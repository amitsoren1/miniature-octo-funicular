import { useImmerReducer } from "use-immer"
import DispatchContext from "./DispatchContext"
import StateContext from "./StateContext"


function ContextManager({children}) {
    const initialState = {
        appLoaded: false,
        loggedIn: Boolean(localStorage.getItem("appToken")),
        socketConnected: false,
        user: {
          token: localStorage.getItem("appToken"),
          profile_picture: null
        },
        chats: [],
        contacts: [],
        unreadChatCount: 0,
        out_call: null,
        in_call: null
      }

      function appReducer(draft, action) {
        switch (action.type) {
          case "connectedSocket":
            draft.socketConnected = true
            return
          case "disconnectedSocket":
            draft.socketConnected = false
            return
          case "login":
            draft.user.token = action.data.token
            localStorage.setItem("appToken", action.data.token)
            draft.loggedIn = Boolean(localStorage.getItem("appToken"))
            return
          case "logout":
            localStorage.removeItem("appToken")
            return {...initialState, socketConnected: true}
          case "updateUser":
            draft.user = {...draft.user, ...action.data}
            return
          case "setChats":
            draft.chats = action.data
            return
          case "addChat":
            // draft.chats.push(action.data)
            draft.chats = [action.data, ...draft.chats]
            return
          case "setContacts":
            draft.contacts = action.data
            return
          case "addContact":
            draft.contacts.push(action.data)
            return
          case "addMessage":
            let chatIndex = draft.chats.findIndex((chat) => chat.chat_with.id === Number(action.data.chat_with_id))
            if(chatIndex===-1) {  // chat doesn't exist already so action.data.new_chat expected
              draft.chats = [action.data.new_chat, ...draft.chats]
              return
            }

            draft.chats = [draft.chats[chatIndex], ...draft.chats.filter(chat=>chat.chat_with.id!==Number(action.data.chat_with_id))]  // Move chat to top
            if(action.data.message.date in draft.chats[chatIndex].messages)
  			        draft.chats[chatIndex].messages[action.data.message.date].push(action.data.message)
		        else
			        draft.chats[chatIndex].messages[action.data.message.date] = [action.data.message]

            if(action.data.message.sender!==draft.user.id)
              draft.chats[chatIndex].unread+=1
            return
          case "setIChatRead":
            let chatIndex2 = draft.chats.findIndex((chat) => chat.chat_with.id === Number(action.data.chat_with_id))
            draft.chats[chatIndex2].unread=0
            return
          case "setOChatRead":
            let chatIndex3 = draft.chats.findIndex((chat) => chat.chat_with.id === Number(action.data.chat_with_id))
            if(chatIndex3===-1)
              return
            Object.keys(draft.chats[chatIndex3].messages).forEach(date => {
                for(var i=0;i<draft.chats[chatIndex3].messages[date].length;i++)
                  if(draft.chats[chatIndex3].messages[date][i].sender===draft.user.id)
                    draft.chats[chatIndex3].messages[date][i].status = "read"
            });
            return
          case "loadApp":
            draft.appLoaded = true
            return
          case "callTo":
            draft.out_call = action.data
            return
          case "callFrom":
            draft.in_call = action.data
            return
          case "clearCall":
            draft.in_call = initialState.in_call
            draft.out_call = initialState.out_call
            return
          default:
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
