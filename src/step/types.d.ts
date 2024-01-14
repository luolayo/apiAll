export type TimeStampData = {
  data: {
    t: string
  }
}
export type loginData = {
  token_info: {
    login_token: string,
    user_id: string,
    app_token: string
  }
}
export type tokenData = {
  token_info: {
    app_token: string
  }
}

export type getStepData = {
  message: string
}
