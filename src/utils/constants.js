/**
 * chứa biến tĩnh, đã fix value
 */

// Những domain được phép truy cập tới tài nguyên của Server
export const WHITELIST_DOMAINS = [
  // KO cần localhost nữa vì ở file config/cors đã luôn cho phép mỗi trường dev(env.BUILD_MODE === 'dev')
  // 'http://localhost:5173'
  // VD sau sẽ deploy lên domin chính thức
]

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}