<template>
    <v-app>
        <v-card-text 
            class = "text-left text-md-center font-weight-bold headerfont my-6 animcontainer" 
            style = "font-size: 50px; line-height: 1.45; margin-left: auto; margin-right: auto; width: 85%;"
            max-width = "500"
        >
            Find out more about your AC usage.
        </v-card-text>
        <v-card max-width = "350" style = "width: 80%; margin-left: auto; margin-right: auto;" class = "animcontainer-d15" flat color = "transparent">
            <v-form @submit.prevent="onSubmit">
                <v-text-field
                    label = "Temperature"
                    v-model = "Temp"
                    suffix = "°C"
                    :rules = "[v => /^\d+$/.test(v) || 'Not a number',
                                v => !!v || 'Require number',
                                v => (v <= 30 && v >= 18) || 'The input must between 18 - 30',]"
                ></v-text-field>
                <v-text-field
                    label = "Hour"
                    v-model = "Hour"
                    :rules = "[v => (/^\d+$/.test(v)) || 'Not a number', v =>  v != 0 || 'Require number']"
                ></v-text-field>
                <v-container>
                    <v-row>
                        <v-switch
                            label = "Contribute this data to the database"
                            class = "text-lefts"
                            v-model = "senddata"
                            color = "grey darken-3"
                        ></v-switch>
                        <v-switch
                            label = "DEBUG"
                            class = "text-lefts"
                            v-model = "result"
                            color = "grey darken-3"
                        ></v-switch>
                    </v-row>
                    <v-row>
                        <v-btn
                            type="submit"
                            block
                            dark
                        >SUBMIT</v-btn>
                    </v-row>

                    <v-row class = "py-3">
                        <v-btn
                            block
                            text
                            @click = "showAdvanced"
                        >ADVANCED</v-btn>
                        <v-expand-transition>
                            <v-card v-show = "advanced" flat color = "transparent">
                                <v-text-field
                                    label = "BTU"
                                    v-model = "btu"
                                    :rules = "[v => /^\d+$/.test(v) || 'Not a number', v => v != 0 || 'Require number']"
                                ></v-text-field>
                            </v-card>
                        </v-expand-transition>
                    </v-row>
                </v-container>
            </v-form>
        </v-card>
        <v-expand-transition>
            <v-card flat style = "display: flex; justify-content: center; align-items: center; width: 80%;" max-width = "600">
                <v-sheet
                    class="v-sheet--offset mx-auto"
                    color="transparent"
                    style = "display: flex; justify-content: center; align-items: center;"
                    >
                    <v-sparkline
                        :labels="labels"
                        :value="value"
                        
                        :gradient="['red','black']"
                        auto-draw = "true"
                        gradient-direction = "left"
                        stroke-linecap = "round"
                        color="black"
                        line-width="2"
                        padding="16"
                    ></v-sparkline>
                </v-sheet>
            </v-card>
        </v-expand-transition>
        <v-card>
            Leaders board
            <v-list disabled>
                <v-list-item-group
                    v-model="selectedItem"
                    color="primary"
                >
                    <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                    >
                        <v-list-item-content>
                            <v-list-item-title v-text="item.country"></v-list-item-title>
                            <v-sparkline
                                :labels="labels"
                                :value="item.value"
                                :gradient="['red','black']"
                                auto-draw = "true"
                                gradient-direction = "left"
                                stroke-linecap = "round"
                                color="black"
                                line-width="2"
                                padding="16"
                            ></v-sparkline>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card>
    </v-app>
</template>

<script>

import {RTDB} from "@/firebase";
export default {
  name: 'App',

  components: {

  },
  data: () => ({
    Temp: 25,
    Hour: "",
    advanced: false,
    result: false,
    senddata: true,
    btu: 12000,
    total: 0,
    data_each_temp: {18:0,19:0,20:0,21:0,22:0,23:0,24:0,25:0,26:0,27:0,28:0,29:0,30:0},
    ip: "",
    country: "",
    labels:['18',   '19',   '20',   '21',   '22',   '23',   '24',   '25',   '26',   '27',   '28',   '29',   '30',],
    value: [200,    675,    410,    390,    310,    460,    250,    240,    0,      0,      0,      0,      0,],
  }),
  methods:{
      async getResult(){
          var H = parseInt(this.Hour,10).toFixed(2)
          var T = parseInt(this.Temp,10).toFixed(2)
          var B = parseInt(this.btu,10).toFixed(2)
          var percent_diff = (100 - ((T - 26) * 6)) / 100.0
          var unit = 0.69 * percent_diff
          var unit_day = unit * H * B / 96000.0
          var cost_day = unit_day * 3.9 
          console.log([unit_day, cost_day])
      },
      async submitData(){
         this.total += 1
         await RTDB.ref("Country/" + this.country).update({Total: this.total})
         this.value[this.Temp-18] += 1
         var r = {}
         r[this.Temp] = this.value[this.Temp-18]
         await RTDB.ref("Country/" + this.country + "/Temperature").update(r)
      }, 
      async checkData(){
          this.value = []
          await RTDB.ref("Country/" + this.country).once('value', snapshot => {
            const data = snapshot.val();
            Object.keys(data).forEach(key => {
                if(key == "Total"){
                    this.total = data[key]
                }if(key == "Temperature"){
                    for(const temp in data[key]){
                        this.value.push(parseInt(data[key][temp],10)) 
                    }
                }
          })
        }) 
      },
      showAdvanced(){
          this.advanced = !this.advanced
      },
      async onSubmit(){
          this.getResult()
          this.checkData()
          if(this.senddata){
              this.submitData()
          }
          this.result = true
      },
  },
  async created(){
      await fetch('https://api.ipify.org?format=json')
        .then(x => x.json())
        .then(({ ip }) => {
         this.ip = ip;
        });
    await fetch('http://ip-api.com/json/' + this.ip)
        .then(x => x.json())
        .then(({ country }) => {
         this.country = country
        });
    console.log(this.ip)
    console.log(this.country)
    await RTDB.ref(`Country`).once('value', snapshot => {
         var b = snapshot.child(this.country).exists();
         if(!b){
             var r = {
                 Total: 0,
                 Temperature: {18:0,19:0,20:0,21:0,22:0,23:0,24:0,25:0,26:0,27:0,28:0,29:0,30:0}
             }
             RTDB.ref("Country/" + this.country).set(r)
         }
    })

  }
};
</script>

<style>
    .animcontainer{
        opacity: 0;
        animation: fadetext 1s;
        animation-delay: 0.1s;
        animation-fill-mode: forwards;
    }

    .animcontainer-d15{
        opacity: 0;
        animation: fadetext 1s;
        animation-delay: 0.6s;
        animation-fill-mode: forwards;
    }

    @keyframes fadetext{
        from{
            opacity: 0;
            transform: translateY(-20px);
        }
        to{
            opacity: 1; 
            transform: translateY(0);
        }
    }
</style>