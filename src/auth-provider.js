const localStorageKey = '__auth_provider_token__'

async function getToken() {
  return window.localStorage.getItem(localStorageKey)
}

function handleUserResponse(response) {
  window.localStorage.setItem(localStorageKey, response.jwt)
  // TagManager.dataLayer({
  //   dataLayer: {
  //     event: 'userLogin',
  //     user: response.user.email,
  //   },
  // });
  return response
}

function login({ email, password }) {
  return client('auth/local', { identifier: email, password }).then(
    handleUserResponse
  )
}

function register({ email, password, firstName = '', lastName = '' }) {
  return client('auth/local/register', {
    email,
    username: email,
    password,
    firstName,
    lastName,
  }).then(handleUserResponse)
}

function resetPassword({ email }) {
  return client('auth/forgot-password', { email }).then(res => res)
}

function newPassword({ code, password, passwordConfirmation }) {
  return client('auth/reset-password', {
    code,
    password,
    passwordConfirmation,
  }).then(res => res)
}

async function logout() {
  window.localStorage.removeItem(localStorageKey)
}

async function client(endpoint, data) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  }

  return window
    .fetch(`${APP_CONFIG.apiHost}/${endpoint}`, config)
    .then(async response => {
      const data = await response.json()
      if (response.ok) {
        return data
      } else {
        if (response.status === 429) {
          return Promise.reject(
            'Te veel mislukte pogingen. Probeer het later nog eens.'
          )
        }

        return Promise.reject(data)
      }
    })
}

export {
  getToken,
  login,
  register,
  resetPassword,
  logout,
  newPassword,
  localStorageKey,
  handleUserResponse,
}
