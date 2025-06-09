<template>
  <div class="issue-list">
    <h2 class="issue-list__title">이슈 목록</h2>

    <div class="issue-list__filter">
      <button
        v-for="option in statusOptions"
        :key="option.value"
        @click="selectedStatus = option.value"
        :class="[
          'issue-list__filter-button',
          { 'issue-list__filter-button--active': selectedStatus === option.value },
        ]"
      >
        {{ option.label }}
      </button>
    </div>

    <table class="issue-list__table">
      <thead>
        <tr>
          <th>No</th>
          <th>제목</th>
          <th>상태</th>
          <th>담당자</th>
          <th>생성일</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(issue, index) in filteredIssues"
          :key="issue.id"
          @click="redirectToDetailIssue(issue.id)"
          class="issue-list__row"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ issue.title }}</td>
          <td>{{ issue.status }}</td>
          <td>{{ issue.user ? issue.user.name : '미지정' }}</td>
          <td>{{ formatDate(issue.createdAt) }}</td>
        </tr>
      </tbody>
    </table>

    <button class="issue-list__create-button" @click="redirectCreateIssue">이슈 생성</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { issues } from '@/data/mockData'

const router = useRouter()
const selectedStatus = ref('ALL')

const statusOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'PENDING', label: '대기' },
  { value: 'IN_PROGRESS', label: '진행중' },
  { value: 'COMPLETED', label: '완료' },
  { value: 'CANCELLED', label: '취소' },
]

const filteredIssues = computed(() => {
  if (selectedStatus.value === 'ALL') return issues
  return issues.filter((issue) => issue.status === selectedStatus.value)
})

const formatDate = (dateString) => dayjs(dateString).format('YYYY.MM.DD HH:mm')

const redirectToDetailIssue = (id) => {
  router.push(`/issues/${id}`)
}

const redirectCreateIssue = () => {
  router.push('/issues/new')
}
</script>

<style lang="scss" scoped>
.issue-list {
  max-width: 800px;
  margin: 32px auto;
  padding: 18px;

  &__title {
    margin-bottom: 16px;
    font-size: 20px;
    font-weight: bold;
  }

  &__filter {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  &__filter-button {
    padding: 8px 16px;
    border: none;
    background-color: #eeeeee;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background-color: #dddddd;
    }

    &--active {
      background-color: #059669;
      color: #ffffff;
    }
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 18px;

    th, td {
      padding: 14px;
      border: 1px solid #cccccc;
      text-align: center;
    }

    th {
      background-color: #f3f3f3;
    }
  }

  &__row {
    cursor: pointer;

    &:hover {
      background-color: #f9f9f9;
    }
  }

  &__create-button {
    padding: 8px 16px;
    background-color: #059669;
    color: #000000;
    border: none;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background-color: #eeeeee;
    }
  }
}
</style>
