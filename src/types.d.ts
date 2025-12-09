declare namespace NodeJS {
	interface ProcessEnv {
		// Kafka Configuration
		KAFKA_CLIENT_ID: string;
		KAFKA_BROKERS: string; // formato: "host1:port1,host2:port2"

		// Event Store Database
		EVENT_STORE_HOST: string;
		EVENT_STORE_PORT: string;
		EVENT_STORE_USER: string;
		EVENT_STORE_PASSWORD: string;
		EVENT_STORE_DATABASE: string;

		// Read Model Database
		READ_MODEL_HOST: string;
		READ_MODEL_PORT: string;
		READ_MODEL_USER: string;
		READ_MODEL_PASSWORD: string;
		READ_MODEL_DATABASE: string;

		// Application
		PORT: string;
		NODE_ENV: string;
	}
}
