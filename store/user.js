import { defineStore } from "pinia";

export const userStore = defineStore({
  id: 'userStore',
  state: () => ({
    user: useSupabaseUser(),
    product: [],
    isAdding: false,
    signInWithPhone: false,
    isViewProduct: false,
    users: [],
    viewOrders: false,
    deleteOrder: false,
    isLoading: false,
    currentAdmin: "",
    resetting: false,
    isAppwriteUser: false,
    showModal: false,
    isUpdating: false,
    notification: [],
    orders:[],
    selected: [],
    isDeleting: false,
    showResetModal: false,
    isEditing: false,
    isSaving: false,
    productData: { id: null, url: "", name: "", size: "", desc: "", category: 'SHOES' },
    searching: false,
  }),

});
