import { useImmerReducer } from "use-immer"
import DispatchContext from "./DispatchContext"
import StateContext from "./StateContext"

function ContextManager({children}) {
    const initialState = {
        loggedIn: Boolean(localStorage.getItem("appToken")),
        user: {
          token: localStorage.getItem("appToken"),
        },
        unreadChatCount: 0,
      }

      function appReducer(draft, action) {
        switch (action.type) {
          case "login":
            draft.loggedIn = true
            draft.user.token = action.data.token
            localStorage.setItem("appToken", action.data.token)
            return
          case "logout":
            draft.loggedIn = false
            localStorage.removeItem("appToken")
            return
        }
      }

    const [state, dispatch] = useImmerReducer(appReducer, initialState)

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

export default ContextManager
