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
            <option value="PENDING">대기</option>
            <option value="IN_PROGRESS" :disabled="form.userId === null">진행중</option>
            <option value="COMPLETED" :disabled="form.userId === null">완료</option>
            <option value="CANCELLED" :disabled="form.userId === null">취소</option>
          </select>
        </div>
      </div>
      <button class="issue-form__button" type="submit">저장</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { issues, users } from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const isEdit = !!route.params.id
const userList = users

const existing = isEdit ? issues.find((issue) => issue.id === Number(route.params.id)) : null

const initialFormData = existing
  ? {
      title: existing.title,
      description: existing.description,
      status: existing.status,
      userId: existing.user?.id ?? null,
    }
  : {
      title: '',
      description: '',
      status: 'PENDING',
      userId: null,
    }

const form = ref({ ...initialFormData })

const isStatusFinal = computed(() => {
  return ['COMPLETED', 'CANCELLED'].includes(form.value.status)
})

const handleSubmit = () => {
  const selectedUser = users.find((user) => user.id === form.value.userId) || null

  if (isEdit) {
    const index = issues.findIndex((issue) => issue.id === Number(route.params.id))
    const prevIssue = issues[index]
    const hadNoAssignee = !prevIssue.user
    const hasAssigneeNow = !!selectedUser
    const updatedStatus =
      hadNoAssignee && hasAssigneeNow && form.value.status === 'PENDING'
        ? 'IN_PROGRESS'
        : form.value.status

    issues[index] = {
      ...issues[index],
      ...form.value,
      status: updatedStatus,
      user: selectedUser,
      updatedAt: new Date().toISOString(),
    }
  } else {
    const nextId = issues.length + 1
    const newIssue = {
      id: nextId,
      ...form.value,
      user: selectedUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: form.value.userId ? form.value.status : 'PENDING',
    }
    issues.push(newIssue)
  }

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
