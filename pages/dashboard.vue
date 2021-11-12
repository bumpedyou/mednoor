<template>
<div class="mh-100v pa-1">
    <a-row class="mb-1">
        <a-col>
              <a-breadcrumb>
                <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
            </a-breadcrumb>
        </a-col>
    </a-row>
    <a-row type="flex" :gutter="[16,16]">
        <a-col :xs="24" :sm="24" :md="{span: 8}" :lg="{span: 4}" flex="1">
            <a-card title="Home Screen"  style="height: 100%; flex: 1;" class="card-primary" @click="$router.push('/home-screen')">
                <p>
                    Update the home screen image.
                </p>
                <a-button type="primary">
                    <a-icon type="home"></a-icon>
                    Update Image
                </a-button>
            </a-card>
        </a-col>
        <a-col :xs="24" :sm="24" :md="{span: 8}" :lg="{span: 4}" flex="1" >
            <a-card title="List Of Users"  style="height: 100%; flex: 1;" class="card-old-rose" @click="$router.push('/users-list')">
                <p>
                    Add, Delete, Block Users.
                </p>
                <a-button type="old-rose">
                    <a-icon type="user"></a-icon>
                    List of Users
                </a-button>
            </a-card>
        </a-col>
        <a-col :xs="24" :sm="24" :md="{span: 8}" :lg="{span: 4}" flex="1" >
            <a-card title="Add User"  style="height: 100%; flex: 1;" class="card-aero-blue" @click="$router.push('/add-user')">
                <p>
                    Shortcut to add user
                </p>
                <a-button type="aero-blue">
                    <a-icon type="user-add"></a-icon>
                    Add User
                </a-button>
            </a-card>
        </a-col>
    </a-row>
</div>
</template>

<script>
export default {
    layout: "dashboard"
}
</script>
