/**
 * Integration Client SDK
 * Used by Personal Assistants to communicate with Dashboard
 */

import crypto from "crypto";

interface IntegrationConfig {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
  webhookSecret?: string;
  timeout?: number;
  retryPolicy?: {
    maxRetries: number;
    backoffMs: number;
  };
}

interface StudentData {
  student_id: number;
  name: string;
  email: string;
  phone?: string;
  level: string;
  class: string;
  status: "ativo" | "inativo" | "desistente" | "trancado";
  enrollment_date?: string;
  birth_date?: string;
  interests?: string[];
  learning_style?: string;
  goals?: string[];
  difficulties?: string[];
}

interface TrackingEvent {
  student_id: number;
  event_type:
    | "quiz_completed"
    | "interaction"
    | "difficulty_identified"
    | "pattern_detected"
    | "ai_adaptation";
  event_data: Record<string, any>;
  source: string;
}

export class DashboardIntegrationClient {
  private config: IntegrationConfig;
  private baseUrl: string;
  private apiKey: string;
  private apiSecret: string;
  private timeout: number;
  private retryPolicy: { maxRetries: number; backoffMs: number };

  constructor(config: IntegrationConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.timeout = config.timeout || 30000;
    this.retryPolicy = config.retryPolicy || {
      maxRetries: 3,
      backoffMs: 1000,
    };
  }

  /**
   * Generate HMAC signature for request
   */
  private generateSignature(payload: string): string {
    return crypto
      .createHmac("sha256", this.apiSecret)
      .update(payload)
      .digest("hex");
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest(
    method: string,
    endpoint: string,
    data?: any,
    attempt: number = 0
  ): Promise<any> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const payload = data ? JSON.stringify(data) : undefined;
      const signature = payload ? this.generateSignature(payload) : "";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "X-Signature": signature,
          "X-Request-ID": crypto.randomUUID(),
        },
        body: payload,
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        // Retry on 5xx errors
        if (response.status >= 500 && attempt < this.retryPolicy.maxRetries) {
          const delay = Math.pow(2, attempt) * this.retryPolicy.backoffMs;
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.makeRequest(method, endpoint, data, attempt + 1);
        }

        throw new Error(
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (attempt < this.retryPolicy.maxRetries) {
        const delay = Math.pow(2, attempt) * this.retryPolicy.backoffMs;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.makeRequest(method, endpoint, data, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Get all active students
   */
  async getStudents(options?: {
    updated_since?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ students: StudentData[]; total: number }> {
    const params = new URLSearchParams();

    if (options?.updated_since) {
      params.append("updated_since", options.updated_since);
    }

    if (options?.limit) {
      params.append("limit", options.limit.toString());
    }

    if (options?.offset) {
      params.append("offset", options.offset.toString());
    }

    const endpoint =
      `/api/integration/students${params.toString() ? `?${params.toString()}` : ""}`;

    return this.makeRequest("GET", endpoint);
  }

  /**
   * Get specific student data
   */
  async getStudent(studentId: number): Promise<StudentData & { learning_profile?: any; recent_events?: any[] }> {
    return this.makeRequest("GET", `/api/integration/students/${studentId}`);
  }

  /**
   * Record a tracking event
   */
  async recordTrackingEvent(event: TrackingEvent): Promise<{
    success: boolean;
    message: string;
    event_id: number;
  }> {
    return this.makeRequest(
      "POST",
      "/api/integration/tracking-events",
      event
    );
  }

  /**
   * Get tracking events for a student
   */
  async getTrackingEvents(
    studentId: number,
    options?: {
      event_type?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ events: any[]; total: number }> {
    const params = new URLSearchParams();

    if (options?.event_type) {
      params.append("event_type", options.event_type);
    }

    if (options?.limit) {
      params.append("limit", options.limit.toString());
    }

    if (options?.offset) {
      params.append("offset", options.offset.toString());
    }

    const endpoint = `/api/integration/students/${studentId}/tracking-events${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    return this.makeRequest("GET", endpoint);
  }

  /**
   * Get student learning profile
   */
  async getLearningProfile(studentId: number): Promise<any> {
    return this.makeRequest(
      "GET",
      `/api/integration/students/${studentId}/learning-profile`
    );
  }

  /**
   * Update student learning profile
   */
  async updateLearningProfile(
    studentId: number,
    profile: {
      learning_style?: string;
      learning_pace?: string;
      engagement_level?: string;
      strengths?: string[];
      weaknesses?: string[];
      ai_adaptation_level?: number;
    }
  ): Promise<{ success: boolean; message: string }> {
    return this.makeRequest(
      "PUT",
      `/api/integration/students/${studentId}/learning-profile`,
      profile
    );
  }

  /**
   * Get sync status for a student
   */
  async getSyncStatus(studentId: number): Promise<any> {
    return this.makeRequest(
      "GET",
      `/api/integration/students/${studentId}/sync-status`
    );
  }

  /**
   * Get integration health metrics
   */
  async getHealthMetrics(): Promise<any> {
    return this.makeRequest("GET", "/api/integration/health");
  }

  /**
   * Validate webhook signature
   */
  validateWebhookSignature(
    payload: string,
    signature: string
  ): boolean {
    const computedSignature = crypto
      .createHmac("sha256", this.apiSecret)
      .update(payload)
      .digest("hex");

    return computedSignature === signature;
  }

  /**
   * Handle incoming webhook
   */
  async handleWebhook(
    payload: string,
    signature: string,
    handler: (data: any) => Promise<void>
  ): Promise<void> {
    // Validate signature
    if (!this.validateWebhookSignature(payload, signature)) {
      throw new Error("Invalid webhook signature");
    }

    // Parse and handle
    const data = JSON.parse(payload);
    await handler(data);
  }

  /**
   * Batch sync students
   */
  async batchSyncStudents(students: StudentData[]): Promise<{
    success: number;
    failed: number;
    errors: Array<{ student_id: number; error: string }>;
  }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ student_id: number; error: string }>,
    };

    for (const student of students) {
      try {
        await this.makeRequest("POST", "/api/integration/students/sync", student);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          student_id: student.student_id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return results;
  }

  /**
   * Stream students (for large datasets)
   */
  async *streamStudents(batchSize: number = 100): AsyncGenerator<StudentData> {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const result = await this.getStudents({
        limit: batchSize,
        offset,
      });

      for (const student of result.students) {
        yield student;
      }

      hasMore = result.students.length === batchSize;
      offset += batchSize;
    }
  }
}

/**
 * Webhook handler helper
 */
export class WebhookHandler {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  /**
   * Verify webhook signature
   */
  verify(payload: string, signature: string): boolean {
    const computedSignature = crypto
      .createHmac("sha256", this.secret)
      .update(payload)
      .digest("hex");

    return computedSignature === signature;
  }

  /**
   * Create signed payload
   */
  sign(data: any): string {
    const payload = JSON.stringify(data);
    const signature = crypto
      .createHmac("sha256", this.secret)
      .update(payload)
      .digest("hex");

    return signature;
  }
}

/**
 * Example usage:
 *
 * const client = new DashboardIntegrationClient({
 *   baseUrl: 'https://dashboard.influx.com',
 *   apiKey: 'pa_key_default_2026',
 *   apiSecret: 'pa_secret_default_2026',
 *   retryPolicy: {
 *     maxRetries: 3,
 *     backoffMs: 1000
 *   }
 * });
 *
 * // Get all students
 * const { students } = await client.getStudents({ limit: 100 });
 *
 * // Record a quiz completion
 * await client.recordTrackingEvent({
 *   student_id: 1,
 *   event_type: 'quiz_completed',
 *   event_data: {
 *     quiz_id: 'vp1-unit-1',
 *     score: 85,
 *     points_earned: 10
 *   },
 *   source: 'personal_assistants'
 * });
 *
 * // Stream large datasets
 * for await (const student of client.streamStudents(1000)) {
 *   console.log(`Processing student: ${student.name}`);
 * }
 */
