export const hasAccess = (userRoles = [], allowedRoles = []) => (
    allowedRoles.some(role => userRoles.includes(role))
)