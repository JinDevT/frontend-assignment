<template>
  <div class="issue-form">
    <h2 class="issue-form__title">{{ isEdit ? '이슈 수정' : '이슈 생성' }}</h2>
    <form class="issue-form__form" @submit.prevent="handleSubmit">
      <div class="issue-form__field">
        <label class="issue-form__label">제목</label>
        <input class="issue-form__input" v-model="form.title" required />
      </div>
      <div class="issue-form__field">
        <label class="issue-form__label">설명</label>
        <textarea class="issue-form__textarea" v-model="form.description" required />
      </div>
      <div class="issue-form__row">
        <div class="issue-form__field">
          <label class="issue-form__label">담당자</label>
          <select
            class="issue-form__select"
            v-model.number="form.userId"
            :disabled="isEdit && isStatusFinal"
          >
            <option :value="null">미지정</option>
            <option v-for="user in userList" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
        <div class="issue-form__field">
          <label class="issue-form__label">상태</label>
          <select
            class="issue-form__select"
            v-model="form.status"
            :disabled="isEdit && isStatusFinal"
          >
            <option
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
              :disabled="option.needsAssignee && form.userId === null"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      <button class="issue-form__button" type="submit">
        {{ isEdit ? '수정' : '생성' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { users } from '@/data/mockData'
import { useIssueStore } from '@/store/useIssueStore'

const route = useRoute()
const router = useRouter()

const issueStore = useIssueStore()
const issues = issueStore.issues

const isEdit = !!route.params.id
const userList = users
const statusOptions = [
  { value: 'PENDING', label: '대기', needsAssignee: false },
  { value: 'IN_PROGRESS', label: '진행중', needsAssignee: true },
  { value: 'COMPLETED', label: '완료', needsAssignee: true },
  { value: 'CANCELLED', label: '취소', needsAssignee: true },
]

const targetIssue = isEdit
  ? issues.find((issue) => issue.id === Number(route.params.id))
  : null

const getInitialFormData = (issue) => {
  if (!issue) {
    return {
      title: '',
      description: '',
      status: 'PENDING',
      userId: null,
    }
  }

  return {
    title: issue.title,
    description: issue.description,
    status: issue.status,
    userId: issue.user?.id ?? null,
  }
}

const initialFormData = getInitialFormData(targetIssue)

const form = ref({ ...initialFormData })

const isStatusFinal = computed(() => {
  return ['COMPLETED', 'CANCELLED'].includes(form.value.status)
})

const createIssue = (selectedUser, now) => {
  const newIssue = {
    id: issues.length + 1,
    ...form.value,
    user: selectedUser,
    createdAt: now,
    updatedAt: now,
    status: selectedUser ? form.value.status : 'PENDING',
  }

  issues.push(newIssue)
}

const updateIssue = (selectedUser, now) => {
  const issueId = Number(route.params.id)
  const index = issues.findIndex(issue => issue.id === issueId)
  const prevIssue = issues[index]

  const shouldUpdateStatus =
    !prevIssue.user && selectedUser && form.value.status === 'PENDING'

  const updatedIssue = {
    ...prevIssue,
    ...form.value,
    status: shouldUpdateStatus ? 'IN_PROGRESS' : form.value.status,
    user: selectedUser,
    updatedAt: now,
  }

  issues[index] = updatedIssue
}

const handleSubmit = () => {
  const selectedUser = users.find(user => user.id === form.value.userId) || null
  const now = new Date().toISOString()

  isEdit ? updateIssue(selectedUser, now) : createIssue(selectedUser, now)
  router.push('/issues')
}

</script>

<style lang="scss" scoped>
.issue-form {
  max-width: 800px;
  margin: 32px auto;
  padding: 16px;

  &__title {
    margin-bottom: 16px;
    font-size: 20px;
    font-weight: bold;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__field {
    display: flex;
    flex-direction: column;
  }

  &__label {
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 500;
  }

  &__input,
  &__textarea,
  &__select {
    padding: 6px;
    border: 1px solid #cccccc;
    border-radius: 6px;
    font-size: 14px;
  }

  &__textarea {
    resize: vertical;
    min-height: 80px;
  }

  &__row {
    display: flex;
    gap: 16px;

    .issue-form__field {
      flex: 1;
    }
  }

  &__button {
    padding: 10px;
    background-color: #059669;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
  }
}
</style>
