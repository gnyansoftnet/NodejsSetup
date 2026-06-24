// import { AppDataSource } from "../config/database.config";
// import { Organisation } from "../entities/organisation.entity";
// import { AppError } from "./app-error";

// export const generateOrgCode = async (orgShortName: string | undefined): Promise<string> => {
//     if (!orgShortName) {
//         throw new AppError(400, "Organisation short name is required to generate org code");
//     }
//     const prefix = orgShortName.toUpperCase();

//     const orgRepo = AppDataSource.getRepository(Organisation);

//     const lastOrg = await orgRepo
//         .createQueryBuilder("organisation")
//         .where("organisation.org_code LIKE :prefix", { prefix: `${prefix}%` })
//         .orderBy("organisation.org_code", "DESC")
//         .getOne();

//     if (!lastOrg) {
//         return `${prefix}0001`;
//     }
//     const lastCodeNumber = parseInt(
//         lastOrg.orgCode.replace(prefix, ""),
//         10
//     );

//     const newCodeNumber = lastCodeNumber + 1;

//     return `${prefix}${String(newCodeNumber).padStart(4, "0")}`;
// };