<script setup lang="ts">
const { chatBoatVisible, userData } = defineProps<{
  chatBoatVisible: boolean;
  userData: {
    type: Object;
    default: { userName: ""; userId: "" };
  };
}>();
import { useToast } from "primevue/usetoast";

const toast = useToast();
const show = (message: string) => {
  toast.add({ severity: "info", detail: message, life: 3000 });
};

const emit = defineEmits(["closeBoat"]);
function closeBoat() {
  emit("closeBoat");
}

const isSubmitting = ref(false);
const isLoading = ref(false);
const question = ref("");
const messages = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);

const getChatAnswer = async (page: number = 1) => {
  isLoading.value = true;
  try {
    const response = await makeCustomRequest({
      url: `api/getchat?user_id=${userData.userId}?page=${page}`,
      method: "GET",
    });
    if (response && response.success) {
      totalPages.value = response.data.last_page;
      messages.value = [...response.data.data.reverse(), ...messages.value];
    } else {
      show("Failed to load chat");
    }
  } catch (error) {
    show("Failed to load chat");
  } finally {
    isLoading.value = false;
  }
};

const submitForm = async (e: Event) => {
  e.preventDefault();
  if (question.value.trim() === "") {
    show("Please enter your message");
    return;
  }
  isSubmitting.value = true;

  try {
    const url = "api/answerchat";
    await makeCustomRequest({
      url,
      method: "POST",
      body: { answer: question.value, user_id_questioned: userData.userId },
    });

    question.value = "";
    currentPage.value = 1;
    messages.value = [];
    // show("success");
    await getChatAnswer();
  } catch (error) {
    show("We're facing some network issues, please try again later.");
  } finally {
    isSubmitting.value = false;
  }
};

const handleScroll = async () => {
  const messagesBox = document.querySelector(".messagesbox");
  if (
    messagesBox &&
    messagesBox.scrollTop === 0 &&
    currentPage.value < totalPages.value
  ) {
    const previousHeight = messagesBox.scrollHeight;
    currentPage.value++;
    await getChatAnswer(currentPage.value);
    messagesBox.scrollTop = messagesBox.scrollHeight - previousHeight;
  }
};
const visible = computed(() => {
  return chatBoatVisible;
});
watch(
  visible,
  (newValue) => {
    console.log("Watcher triggered: chatBoatVisible changed to", newValue);
    if (newValue) {
      console.log("Chatboat opened. Resetting states and fetching data...");
      currentPage.value = 1; // Reset to the first page when chatBoat is shown
      messages.value = []; // Clear messages when it opens
      getChatAnswer(); // Fetch new data
    }
  },
  { immediate: true }
);

onMounted(() => {
  getChatAnswer(currentPage.value);
});
</script>
<template>
  <div v-if="chatBoatVisible" class="chatboat">
    <div class="header">
      <div class="leftside">
        <p class="user-name"><i class="pi pi-reply"></i> {{ userData.userName }}</p>
        <!-- <p class="helper-text">How can we help you?</p> -->
      </div>
      <button @click="closeBoat" class="close-button">
        <i class="pi pi-times"></i>
      </button>
    </div>
    <div class="content">
      <div class="messagesbox" @scroll="handleScroll">
        <span v-if="isLoading" class="loading-more">
          <i class="pi pi-spin pi-spinner"></i>
        </span>
        <div v-for="(msg, index) in messages" :key="index">
          <p class="question">{{ msg.ques }}</p>
          <p
            v-if="msg.answer"
            v-for="(a, index) in msg.answer"
            :key="index"
            class="answer"
          >
            {{ a }}
          </p>
        </div>
      </div>
      <form class="inputbox" @submit="submitForm">
        <input
          type="text"
          v-model="question"
          placeholder="Send a message"
          class="input-field"
        />
        <button type="submit" :disabled="isSubmitting" class="send-button">
          <i class="pi pi-send"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.chatboat {
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  min-height: 85vh;
  background-color: white;
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  .questions {
    width: fit-content;
    margin: 0 0 auto auto;
  }
  .answers {
    width: fit-content;
  }
  .messagesbox {
    overflow: auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #10b981;
    padding: 1rem;
  }

  .user-name {
    text-transform: capitalize;
  }
  .user-name,
  .helper-text {
    color: white;
  }

  .user-name {
    font-size: 1.25rem; /* Text-xl equivalent */
  }

  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #fff;
  }

  .content {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
  }

  .messagesbox {
    padding: 1rem;
    min-height: 59vh;
    max-height: 59vh;
    width: 100%;
    overflow: auto;
  }

  .loading-more {
    text-align: center;
    display: block;
  }

  .question,
  .answer {
    text-transform: capitalize;
    background-color: #10b981;
    padding: 0.5rem;
    border-radius: 0.375rem;
    margin-bottom: 0.75rem;
    color: #fff;
  }

  .question {
    font-size: 13px;
    color: #000;
    background-color: #e5e7eb;
  }

  .answer {
    font-size: 13px;
  }

  .inputbox {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    border-top: 1px solid #d1d5db; /* Border-gray-400 equivalent */
    width: 100%;
  }

  .input-field {
    width: 90%;
    border: none;
    outline: 0;
  }

  .send-button {
    background: none;
    border: none;
    cursor: pointer;
  }
}
</style>
