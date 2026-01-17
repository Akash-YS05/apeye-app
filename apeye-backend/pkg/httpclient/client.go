package httpclient

import (
	"bytes"
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// Client wraps http.Client with additional functionality
type Client struct {
	httpClient *http.Client
}

// NewClient creates a new HTTP client
func NewClient() *Client {
	return &Client{
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
			Transport: &http.Transport{
				TLSClientConfig: &tls.Config{
					InsecureSkipVerify: false,
				},
				MaxIdleConns:        100,
				MaxIdleConnsPerHost: 10,
				IdleConnTimeout:     90 * time.Second,
			},
		},
	}
}

// RequestConfig represents the configuration for an HTTP request
type RequestConfig struct {
	Method  string                 `json:"method"`
	URL     string                 `json:"url"`
	Params  []KeyValue             `json:"params"`
	Headers []KeyValue             `json:"headers"`
	Auth    Auth                   `json:"auth"`
	Body    Body                   `json:"body"`
}

// KeyValue represents a key-value pair
type KeyValue struct {
	ID      string `json:"id"`
	Key     string `json:"key"`
	Value   string `json:"value"`
	Enabled bool   `json:"enabled"`
}

// Auth represents authentication configuration
type Auth struct {
	Type     string  `json:"type"`
	Token    *string `json:"token,omitempty"`
	Username *string `json:"username,omitempty"`
	Password *string `json:"password,omitempty"`
	APIKey   *string `json:"apiKey,omitempty"`
	APIValue *string `json:"apiValue,omitempty"`
}

// Body represents request body configuration
type Body struct {
	Type     string     `json:"type"`
	Content  string     `json:"content"`
	FormData []KeyValue `json:"formData,omitempty"`
}

// Response represents the HTTP response
type Response struct {
	Status     int                    `json:"status"`
	StatusText string                 `json:"statusText"`
	Headers    map[string]string      `json:"headers"`
	Data       interface{}            `json:"data"`
	Time       int64                  `json:"time"` // milliseconds
	Size       int64                  `json:"size"` // bytes
}

// Execute performs the HTTP request
func (c *Client) Execute(config RequestConfig) (*Response, error) {
	startTime := time.Now()

	// Build URL with query parameters
	requestURL, err := c.buildURL(config.URL, config.Params)
	if err != nil {
		return nil, fmt.Errorf("invalid URL: %w", err)
	}

	// Build request body
	var bodyReader io.Reader
	var contentType string
	if config.Method != "GET" && config.Method != "HEAD" {
		bodyReader, contentType, err = c.buildBody(config.Body)
		if err != nil {
			return nil, fmt.Errorf("failed to build body: %w", err)
		}
	}

	// Create HTTP request
	req, err := http.NewRequest(config.Method, requestURL, bodyReader)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	c.setHeaders(req, config.Headers, contentType)

	// Set authentication
	c.setAuth(req, config.Auth)

	// Execute request
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	// Calculate duration
	duration := time.Since(startTime).Milliseconds()

	// Parse response
	response := &Response{
		Status:     resp.StatusCode,
		StatusText: resp.Status,
		Headers:    make(map[string]string),
		Time:       duration,
		Size:       int64(len(body)),
	}

	// Extract headers
	for key, values := range resp.Header {
		if len(values) > 0 {
			response.Headers[key] = values[0]
		}
	}

	// Parse response body
	response.Data = c.parseResponseBody(body, resp.Header.Get("Content-Type"))

	return response, nil
}

// buildURL constructs the full URL with query parameters
func (c *Client) buildURL(baseURL string, params []KeyValue) (string, error) {
	parsedURL, err := url.Parse(baseURL)
	if err != nil {
		return "", err
	}

	// Add query parameters
	if len(params) > 0 {
		query := parsedURL.Query()
		for _, param := range params {
			if param.Enabled && param.Key != "" {
				query.Add(param.Key, param.Value)
			}
		}
		parsedURL.RawQuery = query.Encode()
	}

	return parsedURL.String(), nil
}

// buildBody constructs the request body based on body type
func (c *Client) buildBody(body Body) (io.Reader, string, error) {
	switch body.Type {
	case "json":
		if body.Content == "" {
			return nil, "application/json", nil
		}
		// Validate JSON
		var js json.RawMessage
		if err := json.Unmarshal([]byte(body.Content), &js); err != nil {
			return nil, "", fmt.Errorf("invalid JSON: %w", err)
		}
		return bytes.NewBufferString(body.Content), "application/json", nil

	case "raw":
		return bytes.NewBufferString(body.Content), "text/plain", nil

	case "x-www-form-urlencoded":
		formData := url.Values{}
		if body.FormData != nil {
			for _, item := range body.FormData {
				if item.Enabled && item.Key != "" {
					formData.Add(item.Key, item.Value)
				}
			}
		}
		return bytes.NewBufferString(formData.Encode()), "application/x-www-form-urlencoded", nil

	case "form-data":
		// For now, treat as URL encoded (multipart/form-data requires more complex handling)
		formData := url.Values{}
		if body.FormData != nil {
			for _, item := range body.FormData {
				if item.Enabled && item.Key != "" {
					formData.Add(item.Key, item.Value)
				}
			}
		}
		return bytes.NewBufferString(formData.Encode()), "application/x-www-form-urlencoded", nil

	default:
		return nil, "", nil
	}
}

// setHeaders sets request headers
func (c *Client) setHeaders(req *http.Request, headers []KeyValue, defaultContentType string) {
	// Set default content type if provided
	if defaultContentType != "" {
		req.Header.Set("Content-Type", defaultContentType)
	}

	// Set custom headers (will override default)
	for _, header := range headers {
		if header.Enabled && header.Key != "" {
			req.Header.Set(header.Key, header.Value)
		}
	}

	// Set User-Agent if not provided
	if req.Header.Get("User-Agent") == "" {
		req.Header.Set("User-Agent", "APEye/1.0")
	}
}

// setAuth sets authentication headers
func (c *Client) setAuth(req *http.Request, auth Auth) {
	switch auth.Type {
	case "bearer":
		if auth.Token != nil && *auth.Token != "" {
			req.Header.Set("Authorization", "Bearer "+*auth.Token)
		}

	case "basic":
		if auth.Username != nil && auth.Password != nil {
			credentials := *auth.Username + ":" + *auth.Password
			encoded := base64.StdEncoding.EncodeToString([]byte(credentials))
			req.Header.Set("Authorization", "Basic "+encoded)
		}

	case "api-key":
		if auth.APIKey != nil && auth.APIValue != nil && *auth.APIKey != "" {
			req.Header.Set(*auth.APIKey, *auth.APIValue)
		}
	}
}

// parseResponseBody attempts to parse response body
func (c *Client) parseResponseBody(body []byte, contentType string) interface{} {
	if len(body) == 0 {
		return nil
	}

	// Try to parse as JSON
	if strings.Contains(contentType, "application/json") || strings.Contains(contentType, "text/json") {
		var jsonData interface{}
		if err := json.Unmarshal(body, &jsonData); err == nil {
			return jsonData
		}
	}

	// Return as string
	return string(body)
}