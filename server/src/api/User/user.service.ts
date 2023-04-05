import UserModel from "../../data/user";
import { UserDocument } from "./user.interface";
import createError from "http-errors";

const getAll = async (query: any, pagingOptions: any) => {
  return UserModel.paginate(query, {
    ...pagingOptions,
    select: ["-hash"],
    populate: [
      {
        path: "createdBy",
        select: ["email", "username", "firstName", "lastName"],
      },
      {
        path: "editedBy",
        select: ["email", "username", "firstName", "lastName"],
      },
    ],
  });
};

const getById = async (id: string): Promise<UserDocument | undefined> => {
  const user = await UserModel.findOne({ _id: id }, null, {
    select: ["-hash"],
    populate: [
      {
        path: "createdBy",
        select: ["email", "username", "firstName", "lastName"],
      },
      {
        path: "editedBy",
        select: ["email", "username", "firstName", "lastName"],
      },
    ],
  });
  if (!user) {
    throw createError(400, "The item does not exist");
  }

  return mapToUser(user);
};

const findOne = async (query: any) => {
  return UserModel.findOne({ ...query });
};

const create = async (user: UserDocument): Promise<UserDocument> => {
  const userDocument = new UserModel({
    ...user,
  });

  const savedUser = await userDocument.save();
  return mapToUser(savedUser);
};

const updateUser = async (
  id: string,
  user: UserDocument
): Promise<UserDocument | undefined> => {
  const userDocument = await UserModel.findByIdAndUpdate(
    id,
    { ...user },
    { new: true }
  );

  return userDocument ? mapToUser(userDocument) : undefined;
};

const deleteUser = async (id: string): Promise<any> => {
  return UserModel.findByIdAndDelete(id);
};

const mapToUser = (userDocument: UserDocument): any => {
  return { id: userDocument._id, ...userDocument.toObject() };
};
export default { getAll, getById, findOne, create, updateUser, deleteUser };
