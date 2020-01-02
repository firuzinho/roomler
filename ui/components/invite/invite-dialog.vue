<template>
  <v-dialog v-model="dialog" persistent max-width="880px">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        md="12"
      >
        <v-card>
          <v-expansion-panels
            v-model="panel"
            accordion
            multiple
          >
            <v-expansion-panel>
              <v-expansion-panel-header>New invite</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-form ref="newInviteForm" v-model="isValidNewInvite" lazy-validation>
                  <v-text-field
                    v-model="newInvite.email"
                    :rules="emailRules"
                    label="Email"
                    :name="`email[${newInvite.id}]`"
                    autocomplete="on"
                    required
                    outlined
                  />
                  <v-spacer />
                  <v-text-field
                    v-model="newInvite.name"
                    label="Name"
                    :name="`name[${newInvite.id}]`"
                    autocomplete="on"
                    outlined
                  />
                  <v-spacer />
                  <v-select
                    v-model="newInvite.type"
                    :items="types"
                    no-data-text="Type"
                    label="Type"
                    outlined
                  />
                  <v-btn
                    :disabled="!isValidNewInvite"
                    color="primary"
                    outlined
                    class="justify-end"
                    @click="push"
                  >
                    <v-icon>fa-plus</v-icon> Add invite
                  </v-btn>
                </v-form>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Invite list</v-expansion-panel-header>
              <v-expansion-panel-content>
                <em v-if="!invites.length">
                  Please add some invites in this list.
                </em>
                <v-form ref="invitesForm" v-model="areValidInvites" lazy-validation>
                  <v-row
                    v-for="invite in invites"
                    :key="invite.id"
                    justify="center"
                  >
                    <v-col
                      cols="12"
                      md="4"
                      class="pa-0"
                    >
                      <v-text-field
                        v-model="invite.email"
                        :rules="emailRules"
                        label="Email"
                        :name="`email[${invite.id}]`"
                        autocomplete="on"
                        required
                        outlined
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="3"
                      class="pa-0"
                    >
                      <v-text-field
                        v-model="invite.name"
                        label="Name"
                        :name="`name[${invite.id}]`"
                        autocomplete="on"
                        outlined
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      class="pa-0"
                    >
                      <v-select
                        v-model="invite.type"
                        :items="types"
                        label="Type"
                        no-data-text="Type"
                        outlined
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      class="pa-0"
                    >
                      <v-btn
                        color="red"
                        fab
                        small
                        @click="pop(invite)"
                      >
                        <v-icon>fa-trash-alt</v-icon>
                      </v-btn>
                    </v-col>
                    <v-divider />
                  </v-row>
                </v-form>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" outlined @click="cancelInvites()">
              Cancel
            </v-btn>
            <v-btn
              :disabled="!areValidInvites || !invites.length"
              color="primary"
              outlined
              @click="sendInvites()"
            >
              Send invites
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>
</template>

<script>
import * as uuid from 'uuid/v4'

export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    room: {
      type: Object,
      default: null
    }
  },
  data () {
    const config = this.$store.state.api.config.config
    const defaultInvite = {
      name: '',
      email: '',
      type: config.dataSettings.invite.defaults.type
    }
    const types = config.dataSettings.invite.types
    const newInvite = Object.assign({ id: uuid() }, defaultInvite)

    return {
      isValidNewInvite: true,
      areValidInvites: true,

      emailRules: [
        v => !!v || 'E-mail is required',
        v => /\S+@\S+\.\S+/.test(v) || 'E-mail must be valid'
      ],

      panel: [0, 1],
      defaultInvite,
      newInvite,
      types,
      invites: []
    }
  },
  computed: {
    members () {
      const users = this.room && this.room._id ? [this.room.owner, ...this.room.moderators, ...this.room.members] : []
      return users
    }
  },
  methods: {
    cancelInvites () {
      this.$emit('cancelInvites')
      this.invites = []
    },
    push () {
      if (this.$refs.newInviteForm.validate()) {
        this.newInvite.room = this.room._id
        this.invites.push(this.newInvite)
        this.newInvite = Object.assign({ id: uuid() }, this.defaultInvite)
      }
    },
    pop (invite) {
      this.invites = this.invites.filter(i => i.id !== invite.id)
    },
    sendInvites () {
      if (this.$refs.invitesForm.validate()) {
        this.$emit('sendInvites', this.invites)
        this.invites = []
      }
    }
  }
}
</script>