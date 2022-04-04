<script setup lang="ts">
import { deleteUser, getUsers } from '@/api/users'
import User from '@/types/user'
import { useQuasar } from 'quasar'
import { columns } from './UserIndex'

type User = Pick<User.Bio, 'id' | 'first_name' | 'last_name' | 'email'> &
  Pick<User.Account, 'username'> &
  User.Permission

const q = useQuasar()
const router = useRouter()

const rows = ref<User[]>([])
const loading = ref(true)

const userEdit = (user: User) => {
  router.push({ name: 'User Edit', params: { userId: `${user.id}` } })
}

const fetchTable = async () => {
  rows.value = []
  loading.value = true
  try {
    const { data } = await getUsers({})
    if (data && data.data instanceof Array) {
      /* eslint-disable-next-line */
      data.data.forEach((d: any) => {
        const { email, roles, username, first_name, last_name } = d.attributes

        rows.value.push({
          id: parseInt(d.id),
          email: email,
          roles: roles[0],
          username: username,
          first_name: first_name,
          last_name: last_name,
        })
      })
    }
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const userDelete = async (user: User) => {
  await deleteUser(user.id)
  fetchTable()
}

onBeforeMount(() => {
  fetchTable()
})
</script>

<template>
  <div class="q-ma-md">
    <q-table
      class="user-table user-table__sticky-column"
      title="Users"
      flat
      bordered
      :loading="loading"
      :grid="q.screen.xs"
      :columns="columns"
      :rows="rows"
      row-key="id"
    >
      <template v-slot:body-cell-actions="{ row }">
        <q-td>
          <q-btn-group flat>
            <q-btn
              label="Edit"
              icon="edit"
              size="sm"
              @click="userEdit(row)"
            ></q-btn>
            <q-btn
              label="Delete"
              icon="delete"
              size="sm"
              @click="userDelete(row)"
            ></q-btn>
          </q-btn-group>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<style lang="scss">
.user-table__sticky-column {
  /* set sticky column to the 7th child, which is the `Actions` column */

  th:nth-child(7),
  td:nth-child(7) {
    position: sticky;
    right: 0;
    background-color: #fff;
  }
}

.user-table__header-id {
  width: 100px;
}

.user-table__header-email {
  width: 280px;
}

.user-table__header-role {
  width: 150px;
}

.user-table__header-username {
  width: 200px;
}

.user-table__header-firstname {
  width: 200px;
}

.user-table__header-lastname {
  width: 200px;
}
</style>
