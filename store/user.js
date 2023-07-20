import { defineStore } from "pinia";

 /* using vue3 */
 export const userStore = defineStore('userStore', () => {
    const user=useSupabaseUser() 
    const product = ref([]);
    const isAdding = ref(false);
    const signInWithPhone=ref(false);
    const isViewProduct=ref(false);
    const isLoading = ref(false);
    const showAddModal=ref(false);
    const currentAdmin=ref("");
    const resetting = ref(false);
    const isAppwriteUser = ref(false);
    const showModal = ref(false);
    const isUpdating = ref(false);
    const selected = ref([]);
    const isDeleting = ref(false);
    const showResetModal = ref(false);
    const isEditing = ref(false);
    const isSaving = ref(false);
    const productData = ref({ id: null, url: "", name: "", size: "", desc: "", category:'SHOES'});
    const searching = ref(false);

    
  
    return { user,currentAdmin,isViewProduct,showAddModal, product,resetting,isAppwriteUser,signInWithPhone, isUpdating, isAdding, isLoading, showModal, selected, isDeleting, showResetModal, isEditing, isSaving, productData, searching }
  })