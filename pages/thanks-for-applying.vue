<template>
  <div class='pa-1 mh-100v'>
    <a-row>
      <a-col>
        <h1 class='h1'>Thank You</h1>
        <p>
          Thank you for your interest in being a Provider at Mednoor Medical Center. Mednoor credentialing department
          will contact you as soon as possible
        </p>
        <a-alert message='Please complete your profile information before you get approved.' type='warning'
                 :show-icon='true' class='mb-1'></a-alert>
        <a-button type='success' @click='$router.push(localePath("/my-profile"))'>Complete Information.</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'ThanksForApplying',
  middleware: ['authenticated', 'not-blocked', 'not-deleted']
}
</script>
