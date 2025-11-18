// data/files.ts
import { FileTree } from "../types/fileTypes";

const initialFileTree: Omit<FileTree, "id"> = {
  name: "root",
  type: "folder",
  children: [
    {
      id:'documents',
      name: "Documents",
      type: "folder",
      children: [
        { id:'resume',name: "Resume.pdf", type: "file" },
        { id:'cc',name: "CoverLetter.docx", type: "file" },
      ],
    },
    {
      id:'images',
      name: "Images",
      type: "folder",
      children: [
        {
          id:'png',
          name: ".png",
          type: "folder",
          children: [
            {id:'vacations',name: "Vacation.png", type: "file" },
            { id:'profile',name: "Profile.png", type: "file" },
          ],
        },
        {
          id:'jpg',
          name: ".jpg",
          type: "folder",
          children: [
            {id:'vac',name: "Vacation.jpg", type: "file" },
            { id:'profile',name: "Profile.jpg", type: "file" },
          ],
        },
      ],
    },
    {id:'readme' ,name: "README.txt", type: "file" },
  ],
};

export default initialFileTree;
