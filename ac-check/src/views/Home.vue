<template>
    <v-app class = "grey--text text--darken-4">
        <v-navigation-drawer
            v-model="drawer"
            temporary
            style="max-width: 450px; width: 70%; z-index: 3;"
            fixed
        >
            <v-card class = "mx-2" flat>
                <v-card-text class = "headerfont font-weight-bold my-5" style = "font-size: 30px; line-height: 1.4;">Other Countries Statistics</v-card-text>
                <v-card-text v-show="!result" style = "font-size: 16px; line-height: 1.4;">No data here :( <br> Try submitting your AC stat first</v-card-text>
                <v-expansion-panels flat focusable>
                    <v-expansion-panel
                        v-for="(item, i) in alldata"
                        :key="i"
                        flat
                    >
                        <v-expansion-panel-header disable-icon-rotate>
                        {{i}}
                        <template v-slot:actions>
                            <v-icon>
                            mdi-menu-down
                            </v-icon>
                        </template>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-sparkline
                                :labels="labels_temp"
                                :value="item.value_temp"
                                :gradient="['red','#FFC107', '#8BC34A', '#8BC34A']"
                                gradient-direction = "left"
                                stroke-linecap = "round"
                                color="black"
                                line-width="2"
                                padding="16"
                                class = "my-3"
                                smooth="8"
                            ></v-sparkline>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card>
        </v-navigation-drawer>
        <v-btn @click="showLeaderboard" icon x-large class = "ma-2" style = "z-index: 2; position: fixed; top: 0%; left: 0%;"><v-icon>mdi-menu</v-icon></v-btn>
        <v-card 
            style = "width: 100%; height: 100%; position: absolute; top: 0%; left: 50%; transform: translateX(-50%);" 
            max-width = "1000" 
            flat class = "py-6"
        >
        <v-card-text 
            class = "text-left text-md-center font-weight-bold headerfont mt-6 animcontainer" 
            style = "font-size: 50px; line-height: 1.45; margin-left: auto; margin-right: auto; width: 85%;"
            max-width = "500"
        >
            Find out more about your AC usage.
        </v-card-text>
        <v-card-text class = "text-left text-md-center mb-2 animcontainer-d20" style="margin-left: auto; margin-right: auto; width: 85%; font-size: 14px;">Current Location: <b>{{country}}</b></v-card-text>
        <v-card max-width = "400" style = "width: 80%; margin-left: auto; margin-right: auto;" class = "animcontainer-d15" flat color = "transparent">
            <v-form @submit.prevent="onSubmit">
                <v-row align = "center" style = "height: 70px;">
                    <v-col cols="9" align = "center">
                        <v-slider
                            prepend-icon="mdi-thermometer"
                            min="18"
                            max="30"
                            v-model = "Temp"
                            step="1"
                            class = "mt-4"
                            color = "#3763B2"
                            track-color = "grey lighten-2"
                        ></v-slider>
                    </v-col>

                    <v-col cols="3" align = "center">
                        <v-text-field
                            label = "Temperature"
                            v-model = "Temp"
                            suffix = "°C"
                            :rules = "[v => /^\d+$/.test(v) || 'Not a number',
                                        v => !!v || 'Require number',
                                        v => (v <= 30 && v >= 18) || 'The input must between 18 - 30',]"
                        ></v-text-field>
                    </v-col>
                </v-row>

                <v-row align = "center">
                    <v-col cols="9" align = "center">
                        <v-slider
                            prepend-icon="mdi-timer-sand-full"
                            min="1"
                            max="24"
                            v-model = "Hour"
                            step="1"
                            class = "mt-4"
                            color = "#3763B2"
                            track-color = "grey lighten-2"
                        ></v-slider>
                    </v-col>

                    <v-col cols="3">
                    <v-text-field
                        label = "Hour"
                        v-model = "Hour"
                        :rules = "[v => (/^\d+$/.test(v)) || 'Not a number', 
                                    v => (v <= 24 && v >= 1) || 'The input must between 1 - 24',]"
                    ></v-text-field>
                    </v-col>
                </v-row>
                <v-container>
                    <v-row>
                        <v-switch
                            :disabled="can_submit"
                            label = "Contribute this data to the database"
                            class = "text-lefts"
                            v-model = "senddata"
                            color = "grey darken-3"
                        ></v-switch>
                    </v-row>
                    <v-row>
                        <v-btn
                            type="submit"
                            block
                            dark
                        >
                            <template v-if = "senddata">
                                SUBMIT
                            </template>
                            <template v-else>
                                CHECK
                            </template>
                        </v-btn>
                    </v-row>

                    <v-row class = "py-3">
                        <v-btn
                            block
                            text
                            @click = "showAdvanced"
                        >ADVANCED</v-btn>
                        <v-expand-transition>
                            <v-card v-show = "advanced" flat color = "transparent" class = "my-3">
                                <v-form style = "display: flex;">
                                    <v-text-field
                                        label = "BTU"
                                        v-model = "btu"
                                        class = "mr-2"
                                        prepend-icon = "mdi-flash"
                                        :rules = "[v => /^\d+$/.test(v) || 'Not a number', v => v != 0 || 'Require number']"
                                    ></v-text-field>
                                    <v-text-field
                                        label = "Cost per electric unit "
                                        hint = "(in your currency)"
                                        v-model = "country_unit"
                                        prepend-icon = "mdi-currency-usd"
                                        :rules = "[v => (/^\d+$/.test(v) || /\d+(\.\d+)?/.test(v)) || 'Not a number', v => v != 0 || 'Require number']"
                                    ></v-text-field>
                                </v-form>
                            </v-card>
                        </v-expand-transition>
                    </v-row>
                </v-container>
            </v-form>
        </v-card>
        <v-expand-transition>
            <v-card v-show="result" class = "mt-5" flat max-width = "1000" style = "width: 80%; margin-left: auto; margin-right: auto;">
                <v-divider></v-divider>
                <v-card-text class = "headerfont my-3 font-weight-bold" style = "font-size: 30px; line-height: 1.4;">{{country}} AC Temperature graph</v-card-text>
                <v-sheet
                    class="v-sheet--offset mx-auto"
                    color="transparent"
                    style = "display: flex; justify-content: center; align-items: center;"
                    >
                    <v-sparkline
                        :labels="labels_temp"
                        :value="value_temp"
                        :gradient="['red','#FFC107', '#8BC34A', '#8BC34A']"
                        gradient-direction = "left"
                        stroke-linecap = "round"
                        color="black"
                        line-width="1"
                        padding="16"
                        smooth="8"
                    ></v-sparkline>
                </v-sheet>
                <v-chip
                    class="ma-2"
                    color="#3763B2"
                    text-color="white"
                    >
                   You {{Temp}} &deg;C
                </v-chip>
                <v-chip
                    class="ma-2"
                    color="#3763B2"
                    outlined
                    >
                   Median {{median_temp}} &deg;C
                </v-chip>
                <v-card-text>Your AC emitted</v-card-text>
                <v-card-text class = "headerfont font-weight-bold my-3" style = "font-size: 60px;line-height: 1.4;">
                        {{carbon_day.toFixed(2)}} g
                </v-card-text>
                <v-card-text>of carbon dioxide per day to the world, adding</v-card-text>
                <v-card-text class = "headerfont font-weight-bold my-3" style = "font-size: 60px;line-height: 1.4;">{{cost_day.toFixed(2)}} unit</v-card-text>
                <v-card-text>of your currency to your electricity bill per day.</v-card-text>
                <v-card outlined style = "font-size: 17px; width: 80%; margin-left: auto; margin-right: auto;" class = "font-weight-medium rounded-xl pa-3 mb-4" max-width = "1000">
                    <template v-if="Temp > median_temp">
                        Nice job! You AC emitted carbon dioxide less than median temperature <b>{{carbon_saved.toFixed(2)}} g</b> per day.
                    </template>
                    <template v-if="Temp == median_temp">
                        You AC temperature is equal to the median.
                    </template>
                    <template v-if="Temp < median_temp">
                        Still, your AC temperature is below the median temperature.
                    </template>
                    <template v-if="Temp < median_temp">
                        If you set AC temperature to <b>{{median_temp}} &deg;C</b>, carbon dioxide emission will be reduced by <b>{{-carbon_saved.toFixed(2)}} g</b> per day.
                    </template>
                </v-card>
                <v-divider class = "mb-5 mt-7"></v-divider>
                <v-card-subtitle class = "headerfont font-weight-medium" style = "font-size: 24px; line-height: 1.4;">{{this.head1}}</v-card-subtitle>
                <v-card-text>{{this.text1}}</v-card-text>
                <v-card-subtitle class = "headerfont font-weight-medium" style = "font-size: 24px; line-height: 1.4;">{{this.head2}}</v-card-subtitle>
                <v-card-text>{{this.text2}}</v-card-text>
                <v-card-subtitle class = "headerfont font-weight-medium" style = "font-size: 24px; line-height: 1.4;">{{this.head3}}</v-card-subtitle>
                <v-card-text>{{this.text3}}</v-card-text>
                <v-card-subtitle class = "headerfont font-weight-medium" style = "font-size: 24px; line-height: 1.4;">{{this.head4}}</v-card-subtitle>
                <v-card-text>{{this.text4}}</v-card-text>
                <v-divider class = "my-3"></v-divider>
                <v-card-text class = "headerfont my-3 font-weight-bold" style = "font-size: 30px; line-height: 1.4;">Total hours used of AC in {{country}}</v-card-text>
                <v-sheet
                    class="v-sheet--offset mx-auto"
                    color="transparent"
                    style = "display: flex; justify-content: center; align-items: center;"
                    >
                    
                    <v-sparkline
                        :labels="labels_hour"
                        :value="value_hour"
                        :gradient="['blue','red']"
                        gradient-direction = "left"
                        stroke-linecap = "round"
                        color="black"
                        line-width="1"
                        padding="16"
                        smooth="8"
                    ></v-sparkline>
                </v-sheet>
                <v-card-text class = "mt-10" style = "font-size: 20px;">Currently, total carbon dioxide emitted from AC is</v-card-text>
                <v-card-text class = "headerfont font-weight-bold my-3" style = "font-size: 90px;line-height: 1.4;">
                        {{(world_carbon/1000).toFixed(2)}} kg
                </v-card-text>
                <v-card-text style = "font-size: 20px;">of carbon dioxide.</v-card-text>
                <v-card-text>⬇ Try checking other countries carbon dioxide emission statistics too!</v-card-text>
                <v-btn @click="showLeaderboard" block dark>Countries statistics</v-btn>
            </v-card>
        </v-expand-transition>
        <v-card style = "z-index: 2; position: relative; bottom: 0%; font-size: 12px;" width = "100%" justify = "center" class = "py-3 mt-10" color = "transparent" flat>
            <v-divider class = "mb-4"></v-divider>
            Made by MWIT Team, for NUSH HACK 2021 - 
            <a href = "https://github.com/MW-7892/AC-check" target = "_blank" style = "text-decoration: none;" class = "grey--text text--darken-4 font-weight-bold"> Github</a>
        </v-card>
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
    TargetTemp : 26,
    Hour: "",
    advanced: false,
    result: false,
    senddata: true,
    drawer: false,
    btu: 12000,
    total: 0,
    ip: "0.0.0.0.0",
    country: "unknown",
    alldata: {},
    selectedItem : "",
    head1 : "Setting the thermostat at a lower temperature doesn’t cool your room faster.",
    head2 : "Setting the temperature too high won’t use more electricity.",
    head3 : "Combining fans and AC can save electricity.",
    head4 : "Energy saved for each degree increased in temperature.",
    text1: "The way modern air conditioners work is to keep bumping cool air created from the air compressor into the room until the thermostat detects that the room has reached desired temperature. Then the air compressor will stop working until the temperature goes higher than desired temperature again. So the room will cool down at the same speed, just stay cooled at different temperatures.",
    text2 : "Most of the electricity used by AC is from the air compressor. So, by lowering the temperature you set for the thermostat, the air compressor will have to stay on more often to keep the temperature cool enough. Generally, setting a higher temperature will also save the electricity used by AC.",
    text3 : "This is a quite common suggestion, since it’s a simple method that most people can do. Average pedestal fan consumes 50-55 Watt, while the average 12000 BTU air conditioner consumes 990-1335 Watt. Turning on your fan will allow you to also decrease the thermostat temperature by 1-2 degree celsius without losing any comfort. This method works well for a large room, as a fan can help blow cool wind to a certain spot where you are sitting or sleeping and AC doesn’t have to cool down the entire room.",
    text4 : "Energy saved depends on how much the air compressor works, and that depends on how fast or slow your room can maintain the temperature that you set for your thermostat. This will mostly depend on the temperature outside the room, humidity, size of the room, placement of the AC, etc. The exact amount of energy saved will vary depending on these factors, ranging from 3-10 % from several sources of information. In this project, 6% of energy is estimated to be saved for each degree of temperature increased. ",
    labels_temp:['18',   '19',   '20',   '21',   '22',   '23',   '24',   '25',   '26',   '27',   '28',   '29',   '30',],
    labels_hour: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'],
    value_temp: [200,    675,    410,    390,    310,    460,    250,    240,    0,      0,      0,      0,      0,],
    value_hour: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    median_temp: 26,
    median_hour: 8,
    unit_day: 0.69,
    cost_day: 21.52,
    carbon_day: 293.25,
    country_unit: 2.69,
    unit_day_median: 0.69,
    cost_day_median: 21.52,
    carbon_day_median: 293.25,
    carbon_saved: 0,
    cost_saved: 0,
    total_carbon: 0,
    world_carbon: 0,
    can_submit: true,
  }),
  methods:{
      async getResult(){
          var H = parseInt(this.Hour,10).toFixed(2)
          var T = parseInt(this.Temp,10).toFixed(2)
          var B = parseInt(this.btu,10).toFixed(2)
          var percent_diff = (100.0 - ((T - 26.0) * 6.0)) / 100.0
          this.unit_day = 0.69 * H * B / 12000.0 * percent_diff
          this.cost_day = this.unit_day * this.country_unit 
          this.carbon_day = this.unit_day * 425
          var unit_cmp = (100.0 - ((parseInt(this.median_temp,10).toFixed(2) - 26.0) * 6.0)) / 100.0 * 0.69 * H * B / 12000.0
          this.carbon_saved = (unit_cmp - this.unit_day) * 425
          this.cost_saved = (unit_cmp - this.unit_day) * this.country_unit
          H = parseInt(this.median_hour,10).toFixed(2)
          T = parseInt(this.median_temp,10).toFixed(2)
          B = 12000.0
          percent_diff = (100 - ((T - 26) * 6)) / 100.0
          this.unit_day_median = 0.69 * H * B / 12000.0 * percent_diff
          this.cost_day_median = this.unit_day_median * this.country_unit 
          this.carbon_day_median = this.unit_day_median * 425
          this.result = true
      },
      async checkData(){
          this.value_temp = []
          this.value_hour = []
          await RTDB.ref("Country/" + this.country).once('value', snapshot => {
            const data = snapshot.val();
            Object.keys(data).forEach(key => {
                if(key == "Total"){
                    this.total = data[key]
                }if(key == "Temperature"){
                    for(const temp in data[key]){
                        this.value_temp.push(parseInt(data[key][temp],10)) 
                    }
                }if(key == "Hour"){
                    for(const hour in data[key]){
                        this.value_hour.push(parseInt(data[key][hour],10)) 
                    }
                }if(key == "Carbon"){
                    this.total_carbon = data[key]
                }
            })
        })
      },
      async submitData(){
         this.total = this.total + 1
         var x = {}
         x["Total"] = this.total
         await RTDB.ref("Country/" + this.country).update(x)
         this.value_temp[this.Temp-18] += 1
         var r = {}
         r[this.Temp] = this.value_temp[this.Temp-18]
         await RTDB.ref("Country/" + this.country + "/Temperature").update(r)
         this.value_hour[this.Hour-1] += 1
         var h = {}
         h[this.Hour] = this.value_hour[this.Hour-1]
         await RTDB.ref("Country/" + this.country + "/Hour").update(h)
         
         this.total_carbon += (100.0 - ((parseInt(this.Temp,10).toFixed(2) - 26.0) * 6.0)) / 100.0 * 0.69 * parseInt(this.Hour,10).toFixed(2) * parseInt(this.btu,10).toFixed(2) / 12000.0 * 425.0
         var c = {}
         c["Carbon"] = this.total_carbon

         await RTDB.ref("Country/" + this.country).update(c)
      }, 
      async getLeaderboard(){
          this.world_carbon = 0.0
          this.alldata = {}
          await RTDB.ref("Country").once('value', snapshot => {
            const data = snapshot.val();
            Object.keys(data).forEach(key => {
                if(key != "placeholder" && key != "Total"){
                    var tmp = {}
                    tmp["total"] = data[key]["Total"]
                    tmp["carbon"] = data[key]["Carbon"]
                    this.world_carbon += data[key]["Carbon"]
                    var val = []
                    var sum1 = 0
                    var median_temp = -1
                    for(const t in data[key]["Temperature"]){
                        sum1 += data[key]["Temperature"][t]
                        if(sum1 >= data[key]["Total"]/2 && median_temp == -1){
                            median_temp = t
                        }
                        val.push(data[key]["Temperature"][t])
                    }
                    tmp["median_temp"] = median_temp
                    tmp["value_temp"] = val
                    var val2 = []
                    var sum2 = 0
                    var median_hour = -1
                    for(const h in data[key]["Hour"]){
                        sum2 += data[key]["Hour"][h]
                        if(sum2 >= data[key]["Total"]/2 && median_hour == -1){
                            median_hour = h
                        }
                        val2.push(data[key]["Hour"][h])
                    }
                    tmp["median_hour"] = median_hour
                    tmp["value_hour"] = val2
                    if(tmp["total"] > 0){
                        this.alldata[key] = tmp // bruh
                        if(key == this.country){
                            this.median_temp = tmp["median_temp"]
                            this.median_hour = tmp["median_hour"]
                        }
                    }
                }
          })
        })

      },
      showAdvanced(){
          this.advanced = !this.advanced
      },
      showLeaderboard(){
          this.drawer = !this.drawer
      },
      async onSubmit(){
          await this.checkData()
          if(this.senddata){
              await this.submitData()
              this.$cookies.set("can_submit","1","1d");
              this.senddata = false
          }
          await this.getLeaderboard()
          await this.getResult()
          

          this.can_submit = this.$cookies.get("can_submit") == 0 ? false : true

      },
  },
  async created(){
      if(!this.$cookies.isKey("can_submit")){
          this.$cookies.set("can_submit","0","1d");
      }
      this.can_submit = this.$cookies.get("can_submit") == 0 ? false : true
      this.senddata = !this.can_submit
      await fetch('https://api.ipify.org?format=json')
        .then(x => x.json())
        .then(({ ip }) => {
            if(!(ip != ip)) this.ip = ip;
        });
    if(this.ip != "0.0.0.0.0"){
        await fetch('http://ip-api.com/json/' + this.ip)
        .then(x => x.json())
        .then(({ country }) => {
            if(!(country != country)) this.country = country
        });
    }
    

    await RTDB.ref(`Country`).once('value', snapshot => {
         var b = snapshot.child(this.country).exists();
         if(!b){
             var hour_init = {}
             for(var i = 1;i <= 24;i++){
                 hour_init[i] = 0
             }
             var r = {
                 Total: 0,
                 Carbon: 0,
                 Temperature: {18:0,19:0,20:0,21:0,22:0,23:0,24:0,25:0,26:0,27:0,28:0,29:0,30:0},
                 Hour: hour_init
             }
             RTDB.ref("Country/" + this.country).set(r)
         }
    })
    await this.getLeaderboard()

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
        animation-delay: 0.7s;
        animation-fill-mode: forwards;
    }

    .animcontainer-d20{
        opacity: 0;
        animation: fadetext 1s;
        animation-delay: 0.4s;
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