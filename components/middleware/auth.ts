export default defineNuxtRouteMiddleware(async(to, _from) => {
  const { account, ID } = useAppwrite();
    const user = useSupabaseUser()
    const appWriteUser= await account.get()
    console.log("appWriteUser",appWriteUser);
    
    

  
    if (!user.value) {
      return navigateTo('/Login')
    }
    if (!appWriteUser) {
      return navigateTo('/Login')
    }
  })
  