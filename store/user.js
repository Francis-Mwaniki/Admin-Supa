import { defineStore } from "pinia";

 /* using vue3 */
 export const userStore = defineStore('userStore', () => {
    const user=useSupabaseUser() 
    const product = ref([]);
    const isAdding = ref(false);
    const isLoading = ref(false);
    const resetting = ref(false);
    const showModal = ref(true);
    const isUpdating = ref(false);
    const selected = ref([]);
    const isDeleting = ref(false);
    const showResetModal = ref(false);
    const isEditing = ref(false);
    const isSaving = ref(false);
    const productData = ref({ id: null, url: "", name: "", size: "", desc: "" });
    const searching = ref(false);

    
  
    return { user, product,resetting, isUpdating, isAdding, isLoading, showModal, selected, isDeleting, showResetModal, isEditing, isSaving, productData, searching }
  })