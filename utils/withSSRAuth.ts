import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import decode from 'jwt-decode'
import { validateUserPermissions } from "./validateUserPermissions";

type withSSRAuthOptions = {
    permissions?: string[];
    roles?: string[];
}

export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: withSSRAuthOptions) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx)
        const token = cookies['nextauth.token']
    
        if (!token) {
            return {
                redirect: {
                destination: '/',
                permanent: false
                }
            }
        }

        //CASO O MÉTODO SEJA CHAMADO COM AS OPÇÕES
        //ELE VALIDA AS PERMISSÕES DO USUÁRIO E REDIRECIONA
        //PRO DASHBOARD CASO SE PROVE INVÁLIDO
        if (options) {
            const user = decode<{ permissions: string[], roles: string[] }>(token)
            const { permissions, roles } = options

            const userHasValidPermissions = validateUserPermissions({
                user,
                roles,
                permissions
            })

            if (!userHasValidPermissions) {
                return {
                    redirect: {
                        destination: '/dashboard',
                        permanent: false
                    }
                }
            }
        }



        try {
            return await fn(ctx)
        } catch(err){
            //if (err instanceof AuthTokenError)
            console.log(err)
            destroyCookie(ctx, 'nextauth.token')
            destroyCookie(ctx, 'nextauth.refreshToken')
    
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        }
    }
}