import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const responseSearch = (set, get, data) => {
  set((state) => ({
    searchList: data,
  }));
};

const responseRequestList = (set, get, requestList) => {
  set((state) => ({
    requestList: requestList,
  }));
};

function responseFriendList(set, get, friendList) {
  set((state) => ({
    friendList: friendList,
  }));
}

function responseRequestAccept(set, get, connection) {
  const user = get().user;
  // If I was the one that accepted the request, remove
  // request from the  requestList
  if (user.username === connection.receiver.username) {
    const requestList = [...get().requestList];
    const requestIndex = requestList.findIndex(
      (request) => request.id === connection.id
    );
    if (requestIndex >= 0) {
      requestList.splice(requestIndex, 1);
      set((state) => ({
        requestList: requestList,
      }));
    }
  }
  // If the corresponding user is contained within the
  // searchList for the  acceptor or the  acceptee, update
  // the state of the searchlist item
  const sl = get().searchList;
  if (sl === null) {
    return;
  }
  const searchList = [...sl];

  let searchIndex = -1;
  // If this user  accepted
  if (user.username === connection.receiver.username) {
    searchIndex = searchList.findIndex(
      (user) => user.username === connection.sender.username
    );
    // If the other user accepted
  } else {
    searchIndex = searchList.findIndex(
      (user) => user.username === connection.receiver.username
    );
  }
  if (searchIndex >= 0) {
    searchList[searchIndex].status = "connected";
    set((state) => ({
      searchList: searchList,
    }));
  }
}

const responseRequestConnect = (set, get, connection) => {
  const user = get().user;
  // If i was the one that made the connect request,
  // update the search list row
  if (user.username === connection.sender.username) {
    const searchList = [...get().searchList];
    const searchIndex = searchList.findIndex(
      (request) => request.username === connection.receiver.username
    );
    if (searchIndex >= 0) {
      searchList[searchIndex].status = "pending-them";
      set((state) => ({
        searchList: searchList,
      }));
    }
    // If they were the one  that sent the connect
    // request, add request to request list
  } else {
    const requestList = [...get().requestList];
    const requestIndex = requestList.findIndex(
      (request) => request.sender.username === connection.sender.username
    );
    if (requestIndex === -1) {
      requestList.unshift(connection);
      set((state) => ({
        requestList: requestList,
      }));
    }
  }
};

function responseAdmissionsList(set, get, data) {
  set((state) => ({
    admissionsList: [...get().admissionsList, ...data.results],
    admissionsNext: data.next,
  }));
}

function responseCommentsList(set, get, data) {
  set((state) => ({
    commentsList: [...get().commentsList, ...data.results],
    commentsNext: data.next,
  }));
}

function responseStreamsList(set, get, data) {
  set((state) => ({
    streamsList: [...get().streamsList, ...data.results],
    streamsNext: data.next,
  }));
}

function responseCommentSend(set, get, data) {
  const commentsList = [data, ...get().commentsList];
  set((state) => ({
    commentsList: commentsList,
  }));
}

function responseMessageType(set, get, data) {
  if (data.username !== get().messagesUsername) return;
  set((state) => ({
    messagesTyping: new Date(),
  }));
}

const useGlobal = create((set, get) => ({
  //---------------------
  //   Authentication
  //---------------------

  authenticated: false,
  user: {},

  login: async (user, access_token) => {
    await AsyncStorage.setItem("token-access", access_token);
    set((state) => ({
      authenticated: true,
      user: user,
    }));
  },

  updateUser: async (user) => {
    set((state) => ({
      user: user,
    }));
  },

  logout: () => {
    set((state) => ({
      authenticated: false,
      user: {},
    }));
  },

  //---------------------
  //     Search
  //---------------------

  searchList: null,

  searchUsers: (data) => {
    if (data) {
      responseSearch(set, get, data);
    } else {
      set((state) => ({
        searchList: null,
      }));
    }
  },

  //---------------------
  //     Requests
  //---------------------

  requestList: null,

  requests: (data) => {
    if (data) {
      responseRequestList(set, get, data);
    } else {
      set((state) => ({
        requestList: null,
      }));
    }
  },

  friendList: null,

  friends: (data) => {
    if (data) {
      responseFriendList(set, get, data);
    } else {
      set((state) => ({
        friendList: null,
      }));
    }
  },

  requestConnect: (connection) => {
    responseRequestConnect(set, get, connection);
  },

  requestAccept: (connection) => {
    responseRequestAccept(set, get, connection);
  },

  admissionsList: [],
  admissionsNext: null,
  messagesTyping: null,
  messagesUsername: null,

  init: () => {
    set((state) => ({
      admissionsList: [],
      admissionsNext: null,
      messagesTyping: null,
      messagesUsername: null,
    }));
  },
  admissionList: (list) => {
    if (list.previous === null) {
      set((state) => ({
        admissionsList: [],
        admissionsNext: null,
      }));
    } else {
      set((state) => ({
        admissionsNext: null,
      }));
    }
    responseAdmissionsList(set, get, list);
  },

  commentSend: (data) => {
    responseCommentSend(set, get, data);
  },

  messageType: (username) => {},

  commentsList: [],
  commentsNext: null,

  commentList: (list) => {
    if (list.previous === null) {
      set((state) => ({
        commentsList: [],
        commentsNext: null,
      }));
    } else {
      set((state) => ({
        commentsNext: null,
      }));
    }
    responseCommentsList(set, get, list);
  },

  streamsList: [],
  streamsNext: null,

  streamList: (list) => {
    if (list.previous === null) {
      set((state) => ({
        streamsList: [],
        streamsNext: null,
      }));
    } else {
      set((state) => ({
        streamsNext: null,
      }));
    }
    responseStreamsList(set, get, list);
  },
}));

export default useGlobal;
