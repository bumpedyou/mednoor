<template>
  <v-dialog v-model="localValue" persistent max-width="320px">
    <v-card>
      <v-card-title>{{$props.title}}</v-card-title>
      <v-card-text v-if="$props.description">{{$props.description}}</v-card-text>
      <v-card-actions>
        <v-btn small tile color="error" :disabled="$props.loading" @click="$emit('cancel')">Cancel</v-btn>
        <v-btn small tile color="primary" :loading="$props.loading" @click="$emit('accept')">Accept</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import vmodelMixin from "~/mixins/vmodelMixin";

export default {
  name: "ConfirmDialog",
  mixins: [vmodelMixin],
  props: {
    title: {
      type: String,
      default: 'Confirm action',
    },
    description: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    }
  }
}
</script>
