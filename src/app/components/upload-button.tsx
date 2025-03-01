import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Modal from "./modal";
import { useState } from "react";

export async function CreateFolderButton(props: { parentId: number }) {
  // const user = await auth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleUpload = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreate = (name: string) => {
    setFolderName(name);
    // Here you would typically make an API call to create the folder
    // with the given name and parentId.
    console.log(
      "Creating folder with name:",
      name,
      "and parentId:",
      props.parentId,
    );
    // After successful creation, you might want to close the modal:
    closeModal();
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={handleUpload}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create
        </button>
        <p className="text-sm text-gray-600">New Folder</p>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onCreate={handleCreate}
      />
    </>
  );
}
