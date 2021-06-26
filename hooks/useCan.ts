import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { validateUserPermissions } from "../utils/validateUserPermissions"

type UseCanParams = {
    permissions?: string[];
    roles?: string[];
}

export function useCan({ permissions = [], roles = [] }: UseCanParams){
    const { user, isAuthenticated } = useContext(AuthContext)

    //VERIFICA SE ESTÁ AUTENTICADO
    if (!isAuthenticated) {
        return false
    }

    //CHAMA O MÉTODO QUE VERIFICA AS PERMISSOẼS DE USUÁRIO
    const userHasValidPermissions = validateUserPermissions({
        user,
        roles,
        permissions
    })

    return true
}