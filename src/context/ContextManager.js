import { useImmerReducer } from "use-immer"
import DispatchContext from "./DispatchContext"
import StateContext from "./StateContext"

function ContextManager({children}) {
    const initialState = {
        appLoaded: false,
        loggedIn: Boolean(localStorage.getItem("appToken")),
        user: {
          token: localStorage.getItem("appToken"),
          profile_picture: null
        },
        chats: [],
        contacts: [],
        unreadChatCount: 0,
      }

      function appReducer(draft, action) {
        switch (action.type) {
          case "login":
            draft.loggedIn = Boolean(localStorage.getItem("appToken"))
            draft.user.token = action.data.token
            localStorage.setItem("appToken", action.data.token)
            return
          case "logout":
            draft.chats = initialState.chats
            draft.loggedIn = false
            draft.user = initialState.user
            draft.appLoaded = initialState.appLoaded
            localStorage.removeItem("appToken")
            return
          case "updateUser":
            draft.user = {...draft.user, ...action.data}
            return
          case "setChats":
            draft.chats = action.data
            return
          case "addChat":
            draft.chats.push(action.data)
            return
          case "setContacts":
            draft.contacts = action.data
            return
          case "addContact":
            draft.contacts.push(action.data)
            return
          case "loadApp":
            draft.appLoaded = true
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
