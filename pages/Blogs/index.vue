<template>
  <Toast />
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div v-if="!loading && TableData" class="CustomResponsiveTable table-container">
          <DataTable v-if="TableData" ref="table" :value="TableData" dataKey="id">
            <template #header>
              <div
                class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
              >
                <h5 class="m-0">Manage Blog Posts</h5>
                <Button
                  @click="navigateToAdd"
                  severity="Edit"
                  icon="pi pi-plus"
                  label="Add New Blog"
                />
              </div>
            </template>
            <Column field="id" header="ID" headerStyle="width:auto; min-width:2rem;">
              <template #body="slotProps">
                <span class="p-column-title">ID</span>
                {{ slotProps.index + 1 }}
              </template>
            </Column>
            <Column
              field="title"
              header="Title"
              headerStyle="width:auto; min-width:15rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Title</span>
                {{ slotProps.data.title }}
              </template>
            </Column>
            <Column header="Image" headerStyle="width:auto; min-width:15rem;">
              <template #body="slotProps">
                <img
                  :src="slotProps.data.image[0]?.source"
                  :alt="
                    slotProps.data.image[0]?.source
                      ? slotProps.data.image[0]?.source
                      : 'No Image'
                  "
                  width="40px"
                />
              </template>
            </Column>
            <Column header="Actions" headerStyle="width:auto; min-width:8rem;">
              <template #body="slotProps">
                <span class="p-column-title">Actions</span>
                <div class="flex gap-2">
                  <Button
                    @click="openEditDialog(slotProps.data)"
                    severity="Edit"
                    icon="pi pi-pencil"
                  />
                  <Button
                    @click="confirmDeleteEntry(slotProps.data)"
                    severity="warning"
                    icon="pi pi-trash"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
        <div
          v-else
          class="flex items-center justify-center text-primary"
          style="justify-content: center"
        >
          <span><i class="pi pi-spin pi-spinner text-8xl"></i></span>
        </div>
      </div>
    </div>

    <Dialog
      v-model:visible="deleteDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex align-items-center justify-content-center">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="TableData"
          >Are you sure you want to delete this <b>{{ BlogEntry.title }}</b></span
        >
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteBlog" />
      </template>
    </Dialog>

    <ImageUploader
      :visible="imageUploaderProduct"
      v-model="makeEntry.images"
      @close="imageUploaderProduct = false"
    ></ImageUploader>

    <Dialog
      v-model:visible="editDialogVisible"
      header="Edit Blog Post"
      :style="{ width: '950px' }"
      modal
    >
      <template #default>
        <div>
          <div v-if="editor" class="flex gap-2 flex-wrap">
            <Button
              @click="editor.chain().focus().toggleBold().run()"
              :disabled="!editor.can().chain().focus().toggleBold().run()"
              :class="{ 'is-active': editor.isActive('bold') }"
              label="Bold"
              icon="pi pi-bold"
              class="p-button-sm p-button-outlined"
            />
            <Button
              @click="editor.chain().focus().toggleBold().run()"
              :disabled="!editor.can().chain().focus().toggleBold().run()"
              :class="{ 'is-active': editor.isActive('bold') }"
              label="Bold"
              icon="pi pi-bold"
              class="p-button-sm p-button-outlined"
            />
            <Button
              @click="editor.chain().focus().toggleItalic().run()"
              :disabled="!editor.can().chain().focus().toggleItalic().run()"
              :class="{ 'is-active': editor.isActive('italic') }"
              label="Italic"
              icon="pi pi-italic"
              class="p-button-sm p-button-outlined"
            />
            <Button
              @click="editor.chain().focus().toggleStrike().run()"
              :disabled="!editor.can().chain().focus().toggleStrike().run()"
              :class="{ 'is-active': editor.isActive('strike') }"
              label="Strike"
              icon="pi pi-strikethrough"
              class="p-button-sm p-button-outlined"
            />
            <Button
              @click="editor.chain().focus().toggleCode().run()"
              :disabled="!editor.can().chain().focus().toggleCode().run()"
              :class="{ 'is-active': editor.isActive('code') }"
              label="Code"
              icon="pi pi-code"
              class="p-button-sm p-button-outlined"
            />
            <Button
              @click="editor.chain().focus().unsetAllMarks().run()"
              label="Clear Marks"
              class="p-button-sm p-button-outlined"
            />
            <Button
              @click="editor.chain().focus().clearNodes().run()"
              label="Clear Nodes"
              class="p-button-sm p-button-outlined"
            />
            <Button
              @click="editor.chain().focus().setParagraph().run()"
              :class="{ 'is-active': editor.isActive('paragraph') }"
              label="Paragraph"
              class="p-button-sm p-button-outlined"
            />
            <Button
              v-for="level in [1, 2, 3, 4, 5, 6]"
              :key="level"
              @click="editor.chain().focus().toggleHeading({ level }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level }) }"
              :label="'H' + level"
              class="p-button-sm p-button-outlined"
            />
            <Button
              @click="editor.chain().focus().toggleBulletList().run()"
              :class="{ 'is-active': editor.isActive('bulletList') }"
              label="Bullet List"
              class="p-button-sm p-button-outlined"
            />
            <Button
              @click="editor.chain().focus().toggleOrderedList().run()"
              :class="{ 'is-active': editor.isActive('orderedList') }"
              label="Ordered List"
              class="p-button-sm p-button-outlined"
            />
            <Button
              @click="editor.chain().focus().toggleCodeBlock().run()"
              :class="{ 'is-active': editor.isActive('codeBlock') }"
              label="Code Block"
              class="p-button-sm p-button-outlined"
            />
            <Button
              @click="editor.chain().focus().toggleBlockquote().run()"
              :class="{ 'is-active': editor.isActive('blockquote') }"
              label="Blockquote"
              class="p-button-sm p-button-outlined"
            />
            <Button
              @click="editor.chain().focus().setHorizontalRule().run()"
              label="Horizontal Rule"
              class="p-button-sm p-button-outlined"
            />
            <Button
              @click="editor.chain().focus().setHardBreak().run()"
              label="Hard Break"
              class="p-button-sm p-button-outlined"
            />
            <Button
              @click="editor.chain().focus().undo().run()"
              :disabled="!editor.can().chain().focus().undo().run()"
              label="Undo"
              class="p-button-sm p-button-outlined"
            />
            <Button
              @click="editor.chain().focus().redo().run()"
              :disabled="!editor.can().chain().focus().redo().run()"
              label="Redo"
              class="p-button-sm p-button-outlined"
            />
            <Button
              label="Upload"
              icon="pi pi-upload"
              class="mr-2"
              severity="success"
              @click="imageUploaderProduct = true"
            />
          </div>
          <div class="editablediv border bg-gray-100 p-5 mt-5">
            <input
              type="text"
              v-model="makeEntry.title"
              placeholder="Enter Blog Title"
              class="p-inputtext p-component mb-4"
            />
            <TiptapEditorContent :editor="editor" />
            <Button
              @click="submitBlogPost"
              label="Update Blog"
              class="p-button-lg p-button-fill mt-2 flex justify-center m-auto"
            />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";

const toast = useToast();
const TableData = ref([]);
const loading = ref(false);
const deleteDialog = ref(false);
const editDialogVisible = ref(false);
const BlogEntry = reactive({
  id: "",
  title: "",
});
const imageUploaderProduct = ref(false);
const makeEntry = reactive({ title: "", content: "", images: [] });
// let editor = ref(null);
const editor = useEditor({
  content: makeEntry.content,
  extensions: [TiptapStarterKit],
});

const getTableData = async () => {
  loading.value = true;
  try {
    const response = await makeCustomRequest({
      url: "api/Blogs",
      method: "GET",
    });
    if (response) {
      TableData.value = response;
    } else {
      toast.add({ severity: "error", summary: "Server Error", life: 3000 });
    }
  } catch (error) {
    toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
  } finally {
    loading.value = false;
  }
};

const navigateToAdd = () => {
  navigateTo("/blogs/manageblog");
};

const confirmDeleteEntry = (deleteblogEntry) => {
  console.log("deleteblogEntry", deleteblogEntry);

  BlogEntry.id = deleteblogEntry.id;
  BlogEntry.title = deleteblogEntry.title;
  deleteDialog.value = true;
};

const deleteBlog = async () => {
  try {
    const response = await makeCustomRequest({
      url: `api/Blogs/${BlogEntry.id}`,
      method: "Delete",
    });
    if (response) {
      deleteDialog.value = false;
      getTableData();
    }
  } catch {
    toast.add({ severity: "warn", summary: `Delete blog ID: ${id}`, life: 3000 });
  }
};

const openEditDialog = (blog) => {
  makeEntry.title = blog.title;
  makeEntry.content = blog.content;
  makeEntry.images = blog.image;
  editDialogVisible.value = true;
  BlogEntry.id = blog.id;
  BlogEntry.titlev=blog.title;
  if (!editor) {
    editor = useEditor({
      content: makeEntry.content,
      extensions: [TiptapStarterKit],
    });
  } else {
    editor.value.commands.setContent(makeEntry.content);
  }

  console.log(editor);
};

const submitBlogPost = async () => {
  const element = document.querySelectorAll(".tiptap")[0];
  const content = element.innerHTML;
  const payload = {
    title: makeEntry.title,
    content: content,
    image: makeEntry.images,
  };

  try {
    const response = await makeCustomRequest({
      url: `api/Blogs/${BlogEntry.id}`,
      method: "PATCH",
      body: {...payload},
    });

    if (!response) {
      throw new Error("Network response was not ok: " + response);
    } else {
      toast.add({ severity: "info", summary: `Blog Updated `, life: 3000 });
      editDialogVisible.value = false;
      getTableData();
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

onBeforeUnmount(() => {
  editor.value.destroy();
});
onMounted(() => {
  getTableData();
});
</script>

<style lang="scss">
.editablediv {
  min-height: 300px;
  .ProseMirror {
    min-height: 300px;
    height: 100%;
    border: 1px solid #ddd;
  }
  .p-inputtext {
    max-width: 1024px;
    width: 100%;
  }
  .tiptap.ProseMirror {
    border: 0;
  }
}
</style>
