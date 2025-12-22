export enum urlsMap {
    // Auth
    authLogin = "user/login",

    // Services
    servicesList = "service/services",
    serviceGet = "service/service/:id",
    serviceUpdateName = "service/service/update/name",
    servicesRegister = "service/service/register",
    serviceDelete = "service/service/delete/:id",
    serviceTenantsPaginate = "service/service/:id/tenant/paginate",
}
