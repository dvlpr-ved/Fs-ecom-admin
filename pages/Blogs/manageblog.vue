<template>
  <div>
    <Toast />
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
        :disabled="!isFormValid"
        label="Add Blog"
        class="p-button-lg p-button-fill mt-2 flex justify-center m-auto"
      />
    </div>
  </div>
  <ImageUploader
    :visible="imageUploaderProduct"
    v-model="makeEntry.images"
    @close="imageUploaderProduct = false"
  ></ImageUploader>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();
const editor = useEditor({
  content: "<p>Blog Content Here...</p>",
  extensions: [TiptapStarterKit],
});

const imageUploaderProduct = ref(false);
const makeEntry = reactive({ title: "", content: "", images: [] });

const isFormValid = computed(() => {
  const content = editor;
  return makeEntry.title.trim() !== "" && content !== "<p><br></p>";
});

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
      url: "api/Blogs",
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response) {
      throw new Error("Network response was not ok: " + response);
    } else {
      toast.add({ severity: "info", summary: `Blog Added `, life: 3000 });
      navigateTo("/blogs");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

onBeforeUnmount(() => {
  editor.value.destroy();
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
