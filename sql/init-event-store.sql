CREATE TABLE IF NOT EXISTS events (
    stream_id VARCHAR(255) NOT NULL,
    version INT NOT NULL,
    correlation_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    event_version INT NOT NULL,
    event_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (stream_id, version)
);

CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_type ON events(event_type);
