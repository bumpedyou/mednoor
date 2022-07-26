<template>
  <div>
    <h1>User messages table</h1>
    <div class="w-100">
      <vue-good-table :rows="messages" :columns="columns"></vue-good-table>
    </div>
  </div>
</template>

<script>
export default {
  // TODO: render a table of messages with the following columns:
  // Date, Time, Name, Email, Message, Actions

  data() {
    return {
      messages: [],
      columns: [
        {
          name: 'Date',
          field: 'date',
          sortable: true,
        },
        {
          name: 'Time',
          field: 'time',
          sortable: true,
        },
        {
          name: 'Name',
          field: 'name',
          sortable: true,
        },
        {
          name: 'Email',
          field: 'email',
          sortable: true,
        },
        {
          name: 'Message',
          field: 'message',
          sortable: true,
        },
        {
          name: 'Actions',
          field: 'actions',
          sortable: false,
        },
      ],
    }
  },
}
</script>
