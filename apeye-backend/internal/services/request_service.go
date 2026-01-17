package services

import (
	"encoding/json"

	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/models"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/repository"
	"github.com/Akash-YS05/apeye-app/apeye-backend/pkg/httpclient"
)

type RequestService struct {
	httpClient     *httpclient.Client
	historyRepo    *repository.HistoryRepository
}

func NewRequestService(historyRepo *repository.HistoryRepository) *RequestService {
	return &RequestService{
		httpClient:  httpclient.NewClient(),
		historyRepo: historyRepo,
	}
}

// ExecuteRequest executes an HTTP request and saves to history
func (s *RequestService) ExecuteRequest(userID string, config httpclient.RequestConfig) (*httpclient.Response, error) {
	// Execute the request
	response, err := s.httpClient.Execute(config)
	if err != nil {
		return nil, err
	}

	// Save to history (async, don't block response)
	go s.saveToHistory(userID, config, response)

	return response, nil
}

// saveToHistory saves request/response to history
func (s *RequestService) saveToHistory(userID string, config httpclient.RequestConfig, response *httpclient.Response) {
	// Convert config to JSONB
	requestData, _ := json.Marshal(config)
	responseData, _ := json.Marshal(response)

	history := &models.History{
		UserID:       userID,
		Method:       models.HTTPMethod(config.Method),
		URL:          config.URL,
		RequestData:  models.JSONB{},
		ResponseData: models.JSONB{},
		StatusCode:   response.Status,
		ResponseTime: int(response.Time),
	}

	// Parse JSONB
	json.Unmarshal(requestData, &history.RequestData)
	json.Unmarshal(responseData, &history.ResponseData)

	// Save to database (ignore errors in background save)
	_ = s.historyRepo.Create(history)
}