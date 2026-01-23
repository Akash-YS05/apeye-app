import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'APEye - Modern API Testing Tool';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1e3a5f 0%, transparent 50%), radial-gradient(circle at 75% 75%, #1e3a5f 0%, transparent 50%)',
        }}
      >
        {/* Logo and Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          {/* Icon */}
          <svg
            width="100"
            height="100"
            viewBox="0 0 32 32"
            style={{ marginRight: 24 }}
          >
            <rect width="32" height="32" rx="6" fill="#1e293b" />
            <path
              d="M8 10L5 16L8 22"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24 10L27 16L24 22"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 11C13 11 10.5 13.5 10 16c0.5 2.5 3 5 6 5s5.5-2.5 6-5c-0.5-2.5-3-5-6-5z"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1.5"
            />
            <circle cx="16" cy="16" r="3.5" fill="#3b82f6" />
            <circle cx="16" cy="16" r="1.5" fill="#1e293b" />
          </svg>
          
          {/* Title */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            APEye
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            color: '#94a3b8',
            marginBottom: 50,
            textAlign: 'center',
          }}
        >
          Modern API Testing Tool
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: 'flex',
            gap: 20,
          }}
        >
          {['Fast', 'Intuitive', 'Free'].map((feature) => (
            <div
              key={feature}
              style={{
                backgroundColor: '#1e293b',
                color: '#3b82f6',
                padding: '12px 28px',
                borderRadius: 9999,
                fontSize: 24,
                fontWeight: 500,
                border: '1px solid #334155',
              }}
            >
              {feature}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            color: '#64748b',
          }}
        >
          apeye.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
