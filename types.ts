export interface User {
    id: string
    username: string
    board_limit: 30
    created_at: string | null
  }

  export interface Content {
    id: string,
    user_id: string,
    device_id: string,
    content: string,
    created_at: string 
  }
  