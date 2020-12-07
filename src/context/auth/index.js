import React from 'react'
import { queryCache } from 'react-query'
import * as auth from '../../auth-provider'
import { client } from '../../utils/api-client'
import { useAsync } from '../../utils/hooks'
import { FullPageErrorFallback } from '../../components/lib'
import Loading from '../../elements/Loading'
import TagManager from 'react-gtm-module'

// Bootstrap / Load the initial data from strapi here
async function bootstrapAppData() {
  let user = null

  const token = await auth.getToken()

  // get profile of the user/me and save to user object along with token
  if (token) {
    const userData = await client('users/me', { token })
    userData.jwt = token
    TagManager.dataLayer({
      dataLayer: {
        event: 'userLogin',
        user: userData.email,
      },
    })
    user = userData
  }

  return user
}

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

function AuthProvider(props) {
  const {
    data: user,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    setData,
    run,
  } = useAsync()

  React.useEffect(() => {
    const appDataPromise = bootstrapAppData()
    run(appDataPromise)
  }, [run])

  const login = React.useCallback(
    (form) => auth.login(form).then((user) => setData(user.user)),
    [setData]
  )
  const register = React.useCallback(
    (form) => auth.register(form).then((user) => setData(user.user)),
    [setData]
  )
  const resetPassword = React.useCallback(
    (form) => auth.resetPassword(form).then((token) => setData()),
    [setData]
  )
  const newPassword = React.useCallback(
    (form) => auth.newPassword(form).then((token) => setData()),
    [setData]
  )
  const logout = React.useCallback(() => {
    auth.logout()
    queryCache.clear()
    setData(null)
  }, [setData])

  const value = React.useMemo(
    () => ({
      me: user,
      roles: user ? [user.role.name] : [],
      login,
      resetPassword,
      newPassword,
      logout,
      register,
    }),
    [login, resetPassword, newPassword, logout, register, user]
  )

  // Disabled this since the loading indicators are handled inside the components. So we ommit full page spinner
  if (isLoading) {
    return (
      <div className="col-12 h-25 text-center">
        <Loading />
      </div>
    )
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess || isIdle) {
    return <AuthContext.Provider value={value} {...props} />
  }

  throw new Error(`Unhandled status: ${status}`)
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

function useClient() {
  const { user } = useAuth()

  const token = user?.jwt
  return React.useCallback(
    (endpoint, config) => client(endpoint, { ...config, token }),
    [token]
  )
}

export { AuthProvider, useAuth, useClient }
