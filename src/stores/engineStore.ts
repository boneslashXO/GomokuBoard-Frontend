import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Socket, Channel } from 'phoenix';
import { useGomokuBoardStore } from './gomokuBoardStore';
import { COMMAND_TYPE } from '../components/definitions';

export const useEngineStore = defineStore('engineStore', {
  state: () => ({
    engineOutput: ref(''), // For demonstration, might hold last message or be used differently
    socket: ref<Socket | null>(null), // Use ref to make socket reactive
    channel: ref<Channel | null>(null), // Use ref to make channel reactive
    // Other state properties as needed
  }),
  
  actions: {
    connectToSocket() {
      if (this.socket && this.channel) return; // Assume connection is already established
      this.socket = new Socket("ws://localhost:4000/socket");
      this.socket.connect();
      this.channel = this.socket.channel('AIgame:lobby', {});

      this.channel.join()
        .receive('ok', () => console.log('Successfully joined the AI game lobby'))
        .receive('error', resp => console.error('Unable to join the AI game lobby', resp));

      this.channel.on('engine_output', (response) => {
        // Update `engineOutput` or directly communicate with `gomokuBoardStore`
        this.engineOutput = response.output;
        this.processEngineOutput(response.output);
      });
    },
    sendMessage(commandType: COMMAND_TYPE, commandData: string | undefined) {
      // Ensure `channel` is available and ready
      if (!this.channel) {
        console.error('Channel is not set up.');
        return;
      }
      this.channel.push(commandType, commandData ? { payload: commandData } : {});
    },

    // Example action to process engine output and interact with `gomokuBoardStore`
    processEngineOutput(output: string) {
      // Directly use `gomokuBoardStore` to update UI based on engine output
      useGomokuBoardStore().updateBoardBasedOnEngineOutput(output);
    },
     disconnect() {
      if (this.channel) {
        this.channel.leave(); // Leave the channel
      }
      if (this.socket) {
        this.socket.disconnect(); // Disconnect the socket
      }
      // Reset the refs
      this.socket = null;
      this.channel = null;
    },

  },
});