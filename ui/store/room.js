import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'

export const state = () => ({
  rooms: []
})

export const mutations = {
  setRooms (state, rooms) {
    state.rooms = rooms
  },
  push (state, room) {
    state.rooms.push(room)
  },
  pull (state, room) {
    state.rooms = state.rooms.filter(r => r._id !== room._id)
  }
}

export const actions = {
  async create ({
    commit,
    state
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/room/create', payload)
      commit('push', response.result)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },
  async Get ({
    commit,
    state
  }, id) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/room/get?id=${id}`)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async getAll ({
    commit,
    state
  }) {
    const response = {}
    try {
      response.result = await this.$axios.$get('/api/room/get-all')
      commit('setRooms', response.result)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}