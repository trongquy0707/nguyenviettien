// Định nghĩa kiểu dữ liệu cho response
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// API Service class
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  private getAuthHeaders(): HeadersInit {
    const stored = localStorage.getItem("user");
    let token: string | null = null;

    if (stored) {
      try {
        const user = JSON.parse(stored);
        token = user?.token || null;
      } catch {
        token = null;
      }
    }

    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
      });

      const data = await response.json();
      return {
        data: response.ok ? (data as T) : null,
        error: response.ok ? null : data.message || "GET request failed",
        status: response.status,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      };
    }
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           ...this.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
    const rawText = await response.text();
    let dataResponse: any;
    try {
      dataResponse = rawText ? JSON.parse(rawText) : null;
    } catch {
      dataResponse = { message: rawText };
    }

    return {
      data: response.ok ? dataResponse : null,
      error: response.ok
        ? null
        : dataResponse?.message || "POST request failed",
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Lỗi server",
      status: 500,
    };
  }
}

async postWithFile<T>(
  endpoint: string,
  data?: { [key: string]: unknown } | FormData,
  files?: { [key: string]: File | File[] }
): Promise<ApiResponse<T>> {
  try {
    const url = `${this.baseUrl}${endpoint}`;
    let formDataToSend: FormData;

    // Nếu data là FormData, sử dụng trực tiếp, nếu là object thì tạo mới
    if (data instanceof FormData) {
      formDataToSend = data;
    } else {
      formDataToSend = new FormData();
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          formDataToSend.append(key, value as string | Blob);
        });
      }
    }

    // Thêm file vào FormData nếu có
    if (files) {
      Object.entries(files).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((file) => formDataToSend.append(`${key}[]`, file));
        }
      });
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...this.getAuthHeaders(), 
      },
      body: formDataToSend,
    });

    const rawText = await response.text();
    let dataResponse: any;
    try {
      dataResponse = rawText ? JSON.parse(rawText) : null;
    } catch (parseError) {
      dataResponse = { message: rawText || "Không thể phân tích phản hồi từ server" };
    }

    if (!response.ok) {
      throw new Error(dataResponse?.message || `Request failed with status ${response.status}`);
    }

    return {
      data: dataResponse,
      error: null,
      status: response.status,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Lỗi server",
      status: 500,
    };
  }
}

async getWithFile(
  endpoint: string
): Promise<{ data: Blob | null; error: string | null; status: number }> {
  try {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...this.getAuthHeaders(), 
      },
    });

    const blob = await response.blob();

    if (!response.ok) {
      // Đọc thêm text để lấy lỗi
      const errorText = await blob.text();
      return {
        data: null,
        error: errorText || `Request failed with status ${response.status}`,
        status: response.status,
      };
    }

    return {
      data: blob,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Lỗi server",
      status: 500,
    };
  }
}

}

// Khởi tạo instance của ApiService
const apiService = new ApiService(
 process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:44367/api"
//  process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7186/api"
);

export default apiService;
