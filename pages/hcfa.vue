<template>
  <div class="pa-6">
    <div class="d-flex flex-row justify-center mb-5">
      <div class="d-flex flex-row align-center" style="width: 350px">
        <v-autocomplete
          v-model="currentName"
          :items="patientList"
          item-text="patientName"
          item-value="user_uuid"
          return-object
          rounded
          clearable
          solo
          :hide-details="true"
        ></v-autocomplete>
        <v-btn
          style="margin-left: 10px"
          depressed
          color="primary"
          @click="openHcfa"
        >
          Open
        </v-btn>
      </div>
    </div>
    <div v-if="isLoading === false" class="mh-100v">
      <div class="d-flex flex-row justify-space-between">
        <div class="d-flex flex-column">
          <div div>{{ $data.hcfa.hcfaTitle.pNo }}</div>
          <div>{{ $data.hcfa.hcfaTitle.line1 }}</div>
          <div>{{ $data.hcfa.hcfaTitle.line2 }}</div>
        </div>
        <div class="d-flex flex-row">
          <div class="d-flex flex-column">
            <div>{{ `${$data.number11.c}` }}</div>
            <div>P. O. BOX {{ `${$data.number11.c}` }}</div>
            <div>{{ `${$data.number7.insuredAddress} , ${$data.number7.insuredCity} - ${$data.number7.insuredZipcode}` }}</div>
          </div>
        </div>
        <div class="d-flex flex-row">
          <v-btn depressed color="primary" @click="export2xml">
            Export Xml
          </v-btn>
          <v-btn
            style="margin-left: 10px"
            depressed
            color="primary"
            @click="savehcfa"
          >
            Save
          </v-btn>
        </div>
      </div>

      <div class="hcfa-container">
        <!-- Line 1 -->
        <v-row class="bb-1">
          <v-col cols="8" sm="8" md="8">
            <div class="d-flex flex-row justify-space-around">
              <div v-for="(item, i) in line1" :key="'line1' + i">
                <p v-if="i === 0">{{ `1. ${item.name}` }}</p>
                <p v-else>{{ item.name }}</p>
                <v-checkbox
                  v-model="number1[i]"
                  :false-value="0"
                  :true-value="1"
                  :label="`${item.checkValue}`"
                  @change="checkNumber1(i)"
                ></v-checkbox>
              </div>
            </div>
          </v-col>

          <v-col cols="4" sm="4" md="4" class="lb-1">
            <div class="d-flex">
              <div>1a. INSURED'S I.D.NUMBER</div>
              <div class="ml-auto">(For Program in Item 1)</div>
            </div>
            <v-text-field
              v-model="number1[number1.length - 1]"
              placeholder="enter"
              type="text"
              :hide-details="true"
              :value="`${number1[number1.length - 1]}`"
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- Line 2 -->
        <v-row class="bb-1">
          <v-col cols="8" sm="8" md="8">
            <v-row>
              <v-col cols="7" sm="7" md="7">
                <p>2. PATIENT'S NAME(Last Name, First Name, Middle Initial)</p>
                <!-- <v-text-field v-model="number2.patientName" placeholder="patient name" type="text" :hide-details = true :value="`${number2.patientName}`"></v-text-field> -->
                <p class="pt-5 bb-1">{{ $data.number2.patientName }}</p>
              </v-col>

              <v-col cols="5" sm="5" md="5" class="lb-1">
                <v-row>3. PATIENT'S BIRTH DATE</v-row>
                <v-row>
                  <v-col cols="2" md="2" sm="2" class="p-0">
                    <p>MM</p>
                    <!-- <v-text-field v-model="number3.mm" placeholder="mm" type="text" :hide-details = true :value="`${number3.mm}`"></v-text-field> -->
                    <p class="pt-5 bb-1">{{ $data.number3.mm }}</p>
                  </v-col>
                  <v-col cols="1" md="1" sm="1" class="p-0">
                    <p>DD</p>
                    <!-- <v-text-field v-model="number3.dd" placeholder="dd" type="text" :hide-details = true :value="`${number3.dd}`"></v-text-field> -->
                    <p class="pt-5 bb-1">{{ $data.number3.dd }}</p>
                  </v-col>
                  <v-col cols="4" md="4" sm="4" class="p-0">
                    <p>YY</p>
                    <!-- <v-text-field v-model="number3.yy" placeholder="yy" type="text" :hide-details = true :value="`${number3.yy}`"></v-text-field> -->
                    <p class="pt-5 bb-1">{{ $data.number3.yy }}</p>
                  </v-col>
                  <v-col cols="5" md="5" sm="5" class="p-0">
                    <v-row class="justify-center">SEX</v-row>
                    <v-row class="d-flex justify-space-around">
                      <div class="d-flex flex-row align-center">
                        <p>M</p>
                        <v-checkbox
                          v-model="number3.sex.male"
                          :false-value="0"
                          :true-value="1"
                          :hide-details="true"
                          @change="checkNumber3(0)"
                        >
                        </v-checkbox>
                      </div>
                      <div class="d-flex flex-row align-center">
                        <p>F</p>
                        <v-checkbox
                          v-model="number3.sex.female"
                          :false-value="0"
                          :true-value="1"
                          :hide-details="true"
                          @change="checkNumber3(1)"
                        >
                        </v-checkbox>
                      </div>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="4" sm="4" md="4" class="lb-1">
            <p>4. INSURED'S NAME(Last Name, First Name, Middle Initial)</p>
            <!-- <v-text-field v-model="number4.insuredName" placeholder="insured's name" type="text" :hide-details = true :value="`${number4.insuredName}`" :readonly="true"></v-text-field> -->
            <p class="pt-5 bb-1">{{ $data.number4.insuredName }}</p>
          </v-col>
        </v-row>
        <!-- Line 3 -->
        <v-row class="bb-1">
          <v-col cols="8" sm="8" md="8">
            <v-row>
              <v-col cols="7" sm="7" md="7">
                <p>5. PATIENT'S ADDRESS(No., Street)</p>
                <!-- <v-text-field v-model="number5.patientAddress" placeholder="patient address" type="text" :hide-details = true :value="`${number5.patientAddress}`"></v-text-field> -->
                <p class="pt-5 bb-1">{{ $data.number5.patientAddress }}</p>
              </v-col>

              <v-col
                cols="5"
                sm="5"
                md="5"
                class="lb-1"
                style="display: flex; flex-direction: column"
              >
                <v-row>{{ $data.hcfa.hcfaTitle.line6 }}</v-row>
                <v-row>
                  <v-col
                    v-for="(item, i) in line6"
                    :key="'line6' + i"
                    class="p-0"
                  >
                    <v-checkbox
                      v-model="number6[i]"
                      :false-value="0"
                      :true-value="1"
                      :hide-details="true"
                      :disabled="true"
                      :label="item.checkValue"
                      @change="checkNumber6(i)"
                    >
                    </v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="4" sm="4" md="4" class="lb-1">
            <p>7. INSURED'S ADDRESS(No., Street)</p>
            <!-- <v-text-field v-model="number7.insuredAddress" placeholder="insured's address" type="text" :hide-details = true :value="`${number7.insuredAddress}`"></v-text-field> -->
            <p class="pt-5 bb-1">{{ $data.number7.insuredAddress }}</p>
          </v-col>
        </v-row>
        <!-- Line 4 -->
        <v-row class="bb-1">
          <v-col cols="8" sm="8" md="8">
            <v-row>
              <v-col cols="7" md="7" sm="7">
                <v-row>
                  <v-col cols="8" md="8" sm="8">
                    <p>CITY</p>
                    <!-- <v-text-field v-model="number5.patientCity" placeholder="state" type="text" :hide-details = true :value="`${number5.patientCity}`"></v-text-field> -->
                    <p class="pt-5 bb-1">{{ $data.number5.patientCity }}</p>
                  </v-col>

                  <v-col cols="4" md="4" sm="4" class="lb-1">
                    <p>STATE</p>
                    <!-- <v-text-field v-model="number5.patientState" placeholder="state" type="text" :hide-details = true :value="`${number5.patientState}`"></v-text-field> -->
                    <p class="pt-5 bb-1">{{ $data.number5.patientState }}</p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4" md="4" sm="4">
                    <p>ZIP CODE</p>
                    <!-- <v-text-field v-model="number5.patientZipcode" placeholder="zip code" type="text" :hide-details = true :value="`${number5.patientZipcode}`"></v-text-field> -->
                    <p class="pt-5 bb-1">{{ $data.number5.patientZipcode }}</p>
                  </v-col>

                  <v-col cols="8" md="8" sm="8" class="lb-1">
                    <p>TELEPHONE (Include Area Code)</p>
                    <!-- <v-text-field v-model="number5.patientTelephone" placeholder="telephone" type="text" :hide-details = true :value="`${number5.patientTelephone}`"></v-text-field> -->
                    <p class="pt-5 bb-1">
                      {{ $data.number5.patientTelephone }}
                    </p>
                  </v-col>
                </v-row>
              </v-col>

              <v-col
                cols="5"
                md="5"
                sm="5"
                class="lb-1"
                style="display: flex; flex-direction: column"
              >
                <v-row class="mt-4">{{ $data.hcfa.hcfaTitle.line8 }}</v-row>
                <v-row>
                  <v-col
                    v-for="(item, i) in line8.first"
                    :key="'line8' + i"
                    class="p-none"
                  >
                    <v-checkbox
                      v-model="number8[i]"
                      :false-value="0"
                      :true-value="1"
                      :hide-details="true"
                      :label="item.checkValue"
                      @change="checkNumber8(i)"
                    >
                    </v-checkbox>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    v-for="(item, i) in line8.second"
                    :key="'line8' + i + 3"
                    class="p-none"
                  >
                    <v-checkbox
                      v-model="number8[i + 3]"
                      :false-value="0"
                      :true-value="1"
                      :hide-details="true"
                      :label="item.checkValue"
                      @change="checkNumber8(i + 3)"
                    >
                    </v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="4" sm="4" md="4" class="lb-1">
            <v-col>
              <v-row>
                <v-col cols="8" md="8" sm="8">
                  <p>CITY</p>
                  <!-- <v-text-field v-model="number7.insuredCity" placeholder="state" type="text" :hide-details = true :value="`${number7.insuredCity}`"></v-text-field> -->
                  <p class="pt-5 bb-1">{{ $data.number7.insuredCity }}</p>
                </v-col>

                <v-col cols="4" md="4" sm="4" class="lb-1">
                  <p>STATE</p>
                  <!-- <v-text-field v-model="number7.insuredState" placeholder="state" type="text" :hide-details = true :value="`${number7.insuredState}`"></v-text-field> -->
                  <p class="pt-5 bb-1">{{ $data.number7.insuredState }}</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4" md="4" sm="4">
                  <p>ZIP CODE</p>
                  <!-- <v-text-field v-model="number7.insuredZipcode" placeholder="zip code" type="text" :hide-details = true :value="`${number7.insuredZipcode}`"></v-text-field> -->
                  <p class="pt-5 bb-1">{{ $data.number7.insuredZipcode }}</p>
                </v-col>

                <v-col cols="8" md="8" sm="8" class="lb-1">
                  <p>TELEPHONE (Include Area Code)</p>
                  <!-- <v-text-field v-model="number7.insuredTelephone" placeholder="telephone" type="text" :hide-details = true :value="`${number5.insuredTelephone}`"></v-text-field> -->
                  <p class="pt-5 bb-1">{{ $data.number7.insuredTelephone }}</p>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
        </v-row>
        <!-- Line 5 -->
        <v-row class="bb-1">
          <v-col cols="8" sm="8" md="8">
            <v-row>
              <v-col cols="7" md="7" sm="7">
                <v-row>
                  <v-col>
                    <p>
                      9. OTHER INSURED'S NAME(Last name, First Name, Middle
                      Initial)
                    </p>
                    <v-text-field
                      v-model="number9.value"
                      placeholder="other insured's name"
                      type="text"
                      :hide-details="true"
                      :value="`${number9.value}`"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <p>a. OTHER INSURED'S POLICY OR GROUP NUMBER</p>
                    <v-text-field
                      v-model="number9.a"
                      placeholder="other insured's policy or group number"
                      type="text"
                      :hide-details="true"
                      :value="`${number9.a}`"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <p>b. OTHER INSURED'S DATE OF BIRTH</p>
                    <v-row>
                      <v-col cols="2" md="2" sm="2" class="p-0">
                        <p>MM</p>
                        <v-text-field
                          v-model="number9.b.mm"
                          placeholder="mm"
                          type="text"
                          :hide-details="true"
                          :value="`${number9.b.mm}`"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="1" md="1" sm="1" class="p-0">
                        <p>DD</p>
                        <v-text-field
                          v-model="number9.b.dd"
                          placeholder="dd"
                          type="text"
                          :hide-details="true"
                          :value="`${number9.b.dd}`"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4" md="4" sm="4" class="p-0">
                        <p>YY</p>
                        <v-text-field
                          v-model="number9.b.yy"
                          placeholder="yy"
                          type="text"
                          :hide-details="true"
                          :value="`${number9.b.yy}`"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="5" md="5" sm="5" class="p-0">
                        <v-row class="justify-center">SEX</v-row>
                        <v-row class="d-flex justify-space-around">
                          <div class="d-flex flex-row align-center">
                            <p>M</p>
                            <v-checkbox
                              v-model="number9.b.sex.male"
                              :false-value="0"
                              :true-value="1"
                              :hide-details="true"
                              @change="checkNumber9(0)"
                            >
                            </v-checkbox>
                          </div>
                          <div class="d-flex flex-row align-center">
                            <p>F</p>
                            <v-checkbox
                              v-model="number9.b.sex.female"
                              :false-value="0"
                              :true-value="1"
                              :hide-details="true"
                              @change="checkNumber9(1)"
                            >
                            </v-checkbox>
                          </div>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <p>c. EMPLOYER'S NAME OR SCHOOL NAME</p>
                    <v-text-field
                      v-model="number9.c"
                      placeholder="other insured's policy or group number"
                      type="text"
                      :hide-details="true"
                      :value="`${number9.c}`"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <v-col
                cols="5"
                md="5"
                sm="5"
                class="lb-1"
                style="display: flex; flex-direction: column"
              >
                <v-row class="mt-4">{{ $data.hcfa.hcfaTitle.line10 }}</v-row>
                <v-text-field
                  v-model="number10.value"
                  placeholder="enter"
                  type="text"
                  :hide-details="true"
                  :value="`${number10.value}`"
                ></v-text-field>
                <v-row>
                  <v-col class="p-0">
                    <v-row>{{ line10[0].value }}</v-row>
                    <v-row align="center">
                      <v-checkbox
                        v-model="number10.a.yes"
                        :false-value="0"
                        :true-value="1"
                        :hide-details="true"
                        label="Yes"
                        @change="checkNumber10(0)"
                      >
                      </v-checkbox>
                      <v-checkbox
                        v-model="number10.a.no"
                        :false-value="0"
                        :true-value="1"
                        :hide-details="true"
                        label="No"
                        @change="checkNumber10(1)"
                      >
                      </v-checkbox>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="p-0">
                    <v-row>{{ line10[1].value }}</v-row>
                    <v-row align="center">
                      <v-checkbox
                        v-model="number10.b.yes"
                        :false-value="0"
                        :true-value="1"
                        :hide-details="true"
                        label="Yes"
                        @change="checkNumber10(2)"
                      >
                      </v-checkbox>
                      <v-checkbox
                        v-model="number10.b.no"
                        :false-value="0"
                        :true-value="1"
                        :hide-details="true"
                        label="No"
                        @change="checkNumber10(3)"
                      >
                      </v-checkbox>
                      <div class="ml-auto">
                        <div class="flex flex-column p-none">
                          <div class="f-11">PLACE (State)</div>
                          <v-text-field
                            v-model="number10.b.place"
                            placeholder="enter"
                            type="text"
                            :hide-details="true"
                            :value="`${number10.b.place}`"
                          ></v-text-field>
                        </div>
                      </div>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="p-0">
                    <v-row>{{ line10[2].value }}</v-row>
                    <v-row align="center">
                      <v-checkbox
                        v-model="number10.c.yes"
                        :false-value="0"
                        :true-value="1"
                        :hide-details="true"
                        label="Yes"
                        @change="checkNumber10(4)"
                      >
                      </v-checkbox>

                      <v-checkbox
                        v-model="number10.c.no"
                        :false-value="0"
                        :true-value="1"
                        :hide-details="true"
                        label="No"
                        @change="checkNumber10(5)"
                      >
                      </v-checkbox>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="4" sm="4" md="4" class="lb-1">
            <v-row>
              <v-col>
                <v-row>
                  <v-col>
                    <p>11. INSURED'S POLICY GROUP OR FECA NUMBER</p>
                    <v-text-field
                      v-model="number11.value"
                      placeholder="other insured's name"
                      type="text"
                      :hide-details="true"
                      :value="`${number11.value}`"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <p>a. INSURED'S DATE OF BIRTH</p>
                    <v-row>
                      <v-col cols="2" md="2" sm="2" class="p-0">
                        <p>MM</p>
                        <!-- <v-text-field v-model="number11.a.mm" placeholder="mm" type="text" :hide-details = true :value="`${number11.a.mm}`"></v-text-field> -->
                        <p class="bb-1 mr-3">{{ `${number11.a.mm}` }}</p>
                      </v-col>
                      <v-col cols="1" md="1" sm="1" class="p-0">
                        <p>DD</p>
                        <!-- <v-text-field v-model="number11.a.dd" placeholder="mm" type="text" :hide-details = true :value="`${number11.a.dd}`"></v-text-field> -->
                        <p class="bb-1 mr-3">{{ `${number11.a.dd}` }}</p>
                      </v-col>
                      <v-col cols="4" md="4" sm="4" class="p-0">
                        <p>YY</p>
                        <!-- <v-text-field v-model="number11.a.yy" placeholder="mm" type="text" :hide-details = true :value="`${number11.a.yy}`"></v-text-field> -->
                        <p class="bb-1 mr-3">{{ `${number11.a.yy}` }}</p>
                      </v-col>
                      <v-col cols="5" md="5" sm="5" class="p-0">
                        <v-row class="justify-center">SEX</v-row>
                        <v-row class="d-flex justify-space-around">
                          <div class="d-flex flex-row align-center">
                            <p>M</p>
                            <v-checkbox
                              v-model="number11.a.sex.male"
                              :false-value="0"
                              :true-value="1"
                              :hide-details="true"
                              :disabled="true"
                              @change="checkNumber11(0)"
                            >
                            </v-checkbox>
                          </div>
                          <div class="d-flex flex-row align-center">
                            <p>F</p>
                            <v-checkbox
                              v-model="number11.a.sex.female"
                              :false-value="0"
                              :true-value="1"
                              :hide-details="true"
                              :disabled="true"
                              @change="checkNumber11(1)"
                            >
                            </v-checkbox>
                          </div>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <p>b. EMPLOYER'S NAME OR SCHOOL NAME</p>
                    <v-text-field
                      v-model="number11.b"
                      placeholder="mm"
                      type="text"
                      :hide-details="true"
                      :value="`${number11.b}`"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <p>c. INSURANCE PLAN NAME OR PROGRAM NAME</p>
                    <!-- <v-text-field v-model="number11.c" placeholder="mm" type="text" :hide-details = true :value="`${number11.c}`"></v-text-field> -->
                    <p class="pt-5 bb-1">{{ $data.number11.c }}</p>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- Line 6 -->
        <v-row class="bb-1">
          <v-col cols="8" sm="8" md="8">
            <v-row>
              <v-col cols="7" sm="7" md="7">
                <p>d. INSURANCE PLAN NAME OR PROGRAM NAME</p>
                <v-text-field
                  v-model="number9.d"
                  placeholder="patient name"
                  type="text"
                  :hide-details="true"
                  :value="`${number9.d}`"
                ></v-text-field>
              </v-col>

              <v-col cols="5" sm="5" md="5" class="lb-1">
                <p>10d. RESERVED FOR LOCAL USE</p>
                <v-text-field
                  v-model="number10.d"
                  placeholder="patient name"
                  type="text"
                  :hide-details="true"
                  :value="`${number10.d}`"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="4" sm="4" md="4" class="lb-1">
            <div class="d-flex flex-column align-start">
              <p>d. IS THERE ANOTHER HEALTH BENEFIT PLAN?</p>
              <div class="d-flex flex-row align-center">
                <v-checkbox
                  v-model="number11.d.yes"
                  :false-value="0"
                  :true-value="1"
                  :hide-details="true"
                  label="Yes"
                  @change="checkNumber11(2)"
                >
                </v-checkbox>
                <v-checkbox
                  v-model="number11.d.no"
                  :false-value="0"
                  :true-value="1"
                  :hide-details="true"
                  label="No"
                  @change="checkNumber11(3)"
                >
                </v-checkbox>
                <span class="ml-3 f-11"
                  ><b>If yes</b>, return to and complete item 9 a-d</span
                >
              </div>
            </div>
          </v-col>
        </v-row>
        <!-- Line 7 -->
        <v-row class="bb-1">
          <v-col cols="8" sm="8" md="8">
            <b>READ BACK OF FORM BEFORE COMPLETING & SIGNING THIS FORM</b>
            <p>
              12. PATIENT'S OR AUTHORIZED PERSON'S SIGNATURE I authorize the
              release of any medical or other information necessary to process
              this claim. I also request payment of government benefits either
              to myself or to the party who accepts assignment below
            </p>
            <div class="d-flex align-center">
              <v-row>
                <v-col cols="8" md="8" sm="8">
                  <div class="d-flex flex-direction-row align-center">
                    <div class="mr-2">SIGNED</div>
                    <v-text-field
                      v-model="number12.signed"
                      placeholder="signed"
                      type="text"
                      :hide-details="true"
                      :value="`${number12.signed}`"
                    ></v-text-field>
                  </div>
                </v-col>
                <v-col cols="4" md="4" sm="4">
                  <div class="d-flex flex-direction-row align-center">
                    <div class="mr-2">DATE</div>
                    <v-text-field
                      v-model="number12.date"
                      placeholder="date"
                      type="text"
                      :hide-details="true"
                      :value="`${number12.date}`"
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <v-col cols="4" sm="4" md="4" class="lb-1">
            <p>
              13. INSURED'S OR AUTHORIZED PERSON'S SIGNATURE I authorize payment
              of medical benefits to the undersigned physician or supplier for
              services described below.
            </p>
            <div class="d-flex flex-direction-row align-center">
              <div class="mr-2">SIGNED</div>
              <v-text-field
                v-model="number13.value"
                placeholder="signed"
                type="text"
                :hide-details="true"
                :value="`${number13.value}`"
              ></v-text-field>
            </div>
          </v-col>
        </v-row>
        <!-- Line 8 -->
        <v-row class="bb-1">
          <v-col cols="8" sm="8" md="8">
            <v-row>
              <v-col cols="7" sm="7" md="7">
                <v-row>
                  <v-col cols="7" md="7" sm="7">
                    <p>14. DATE OF CURRENT:</p>
                    <v-row>
                      <v-col cols="2" md="2" sm="2" class="p-0">
                        <p>MM</p>
                        <v-text-field
                          v-model="number14.mm"
                          placeholder="mm"
                          type="text"
                          :hide-details="true"
                          :value="`${number14.mm}`"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="2" md="2" sm="2" class="p-0">
                        <p>DD</p>
                        <v-text-field
                          v-model="number14.dd"
                          placeholder="dd"
                          type="text"
                          :hide-details="true"
                          :value="`${number14.dd}`"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4" md="4" sm="4" class="p-0">
                        <p>YY</p>
                        <v-text-field
                          v-model="number14.yy"
                          placeholder="yy"
                          type="text"
                          :hide-details="true"
                          :value="`${number14.yy}`"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4" md="4" sm="4" class="p-0">
                        <v-row class="justify-center">SEX</v-row>
                        <v-row class="d-flex justify-space-around">
                          <div class="d-flex flex-row align-center">
                            <p>M</p>
                            <v-checkbox
                              v-model="number14.sex.male"
                              :false-value="0"
                              :true-value="1"
                              :hide-details="true"
                              @change="checkNumber14(0)"
                            >
                            </v-checkbox>
                          </div>
                          <div class="d-flex flex-row align-center">
                            <p>F</p>
                            <v-checkbox
                              v-model="number14.sex.female"
                              :false-value="0"
                              :true-value="1"
                              :hide-details="true"
                              @change="checkNumber14(1)"
                            >
                            </v-checkbox>
                          </div>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="5" md="5" sm="5" class="lb-1">
                    <p>ILLNESS (First symptom) OR</p>
                    <p>INJURY (Accident) OR</p>
                    <p>PREGNANCY (LMP) OR</p>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="5" sm="5" md="5" class="lb-1">
                <p>15. IF PATIENT HAS HAD SAME OR SIMILAR ILLNESS</p>
                <v-row align="center">
                  <v-col cols="4" md="4" sm="4" class="p-0">
                    <span>GIVE FIRST DATE</span>
                  </v-col>
                  <v-col cols="2" md="2" sm="2   " class="p-0">
                    <p>MM</p>
                    <v-text-field
                      v-model="number15.mm"
                      placeholder="mm"
                      type="text"
                      :hide-details="true"
                      :value="`${number15.mm}`"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2" md="2" sm="2" class="p-0">
                    <p>DD</p>
                    <v-text-field
                      v-model="number15.dd"
                      placeholder="dd"
                      type="text"
                      :hide-details="true"
                      :value="`${number15.dd}`"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" md="4" sm="4" class="p-0">
                    <p>YY</p>
                    <v-text-field
                      v-model="number15.yy"
                      placeholder="yy"
                      type="text"
                      :hide-details="true"
                      :value="`${number15.yy}`"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="4" sm="4" md="4" class="lb-1">
            <div class="d-flex flex-column align-start">
              <p>16. DATES PATIENT UNABLE TO WORK IN CURRENT OCCUPATION</p>
              <v-row>
                <v-col cols="6" md="6" sm="6">
                  <v-row align="center">
                    <v-col cols="4" md="4" sm="4" class="p-0">
                      <span>FROM</span>
                    </v-col>
                    <v-col cols="2" md="2" sm="2   " class="p-0">
                      <p>MM</p>
                      <v-text-field
                        v-model="number16.from.mm"
                        placeholder="mm"
                        type="text"
                        :hide-details="true"
                        :value="`${number16.from.mm}`"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2" md="2" sm="2" class="p-0">
                      <p>DD</p>
                      <v-text-field
                        v-model="number16.from.dd"
                        placeholder="dd"
                        type="text"
                        :hide-details="true"
                        :value="`${number16.from.dd}`"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4" md="4" sm="4" class="p-0">
                      <p>YY</p>
                      <v-text-field
                        v-model="number16.from.yy"
                        placeholder="yy"
                        type="text"
                        :hide-details="true"
                        :value="`${number16.from.yy}`"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="6" md="6" sm="6">
                  <v-row align="center">
                    <v-col cols="4" md="4" sm="4" class="p-0">
                      <span>TO</span>
                    </v-col>
                    <v-col cols="2" md="2" sm="2   " class="p-0">
                      <p>MM</p>
                      <v-text-field
                        v-model="number16.to.mm"
                        placeholder="mm"
                        type="text"
                        :hide-details="true"
                        :value="`${number16.to.mm}`"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2" md="2" sm="2" class="p-0">
                      <p>DD</p>
                      <v-text-field
                        v-model="number16.to.dd"
                        placeholder="dd"
                        type="text"
                        :hide-details="true"
                        :value="`${number16.to.dd}`"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4" md="4" sm="4" class="p-0">
                      <p>YY</p>
                      <v-text-field
                        v-model="number16.to.yy"
                        placeholder="yy"
                        type="text"
                        :hide-details="true"
                        :value="`${number16.to.yy}`"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
        <!-- Line 9 -->
        <v-row class="bb-1">
          <v-col cols="8" sm="8" md="8">
            <v-row>
              <v-col cols="7" sm="7" md="7">
                <v-row>
                  <v-col>
                    <p>17. NAME OF REFERRING PROVIDER OR OTHER SOURCE</p>
                    <v-text-field
                      v-model="number17.value"
                      placeholder="name of referring provider or other source"
                      type="text"
                      :hide-details="true"
                      :value="`${number17.value}`"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="5" sm="5" md="5" class="lb-1">
                <div class="bb-1">
                  <v-row>
                    <v-col cols="3" md="3" sm="3">17a.</v-col>
                    <v-col cols="3" md="3" sm="3" class="lb-1">
                      <v-text-field
                        v-model="number17.a.first"
                        placeholder=""
                        type="text"
                        :hide-details="true"
                        :value="`${number17.a.first}`"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" md="6" sm="6" class="lb-1">
                      <v-text-field
                        v-model="number17.a.second"
                        placeholder=""
                        type="text"
                        :hide-details="true"
                        :value="`${number17.a.second}`"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>
                <div>
                  <v-row>
                    <v-col cols="3" md="3" sm="3">17a.</v-col>
                    <v-col cols="3" md="3" sm="3" class="lb-1">17.b</v-col>
                    <v-col cols="6" md="6" sm="6" class="lb-1"
                      ><v-text-field
                        v-model="number17.b"
                        placeholder="name of referring provider or other source"
                        type="text"
                        :hide-details="true"
                        :value="`${number17.b}`"
                      ></v-text-field
                    ></v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="4" sm="4" md="4" class="lb-1">
            <div class="d-flex flex-column align-start">
              <p>18. HOSPITALIZATION DATES RELATED TO CURRENT SERVICES</p>
              <v-row>
                <v-col cols="6" md="6" sm="6">
                  <v-row align="center">
                    <v-col cols="4" md="4" sm="4" class="p-0">
                      <span>FROM</span>
                    </v-col>
                    <v-col cols="2" md="2" sm="2   " class="p-0">
                      <p>MM</p>
                      <v-text-field
                        v-model="number18.from.mm"
                        placeholder="mm"
                        type="text"
                        :hide-details="true"
                        :value="`${number18.from.mm}`"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2" md="2" sm="2" class="p-0">
                      <p>DD</p>
                      <v-text-field
                        v-model="number18.from.dd"
                        placeholder="dd"
                        type="text"
                        :hide-details="true"
                        :value="`${number18.from.dd}`"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4" md="4" sm="4" class="p-0">
                      <p>YY</p>
                      <v-text-field
                        v-model="number18.from.yy"
                        placeholder="yy"
                        type="text"
                        :hide-details="true"
                        :value="`${number18.from.yy}`"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="6" md="6" sm="6">
                  <v-row align="center">
                    <v-col cols="4" md="4" sm="4" class="p-0">
                      <span>TO</span>
                    </v-col>
                    <v-col cols="2" md="2" sm="2   " class="p-0">
                      <p>MM</p>
                      <v-text-field
                        v-model="number18.to.mm"
                        placeholder="mm"
                        type="text"
                        :hide-details="true"
                        :value="`${number18.to.mm}`"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2" md="2" sm="2" class="p-0">
                      <p>DD</p>
                      <v-text-field
                        v-model="number18.to.dd"
                        placeholder="dd"
                        type="text"
                        :hide-details="true"
                        :value="`${number18.to.dd}`"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4" md="4" sm="4" class="p-0">
                      <p>YY</p>
                      <v-text-field
                        v-model="number18.to.yy"
                        placeholder="yy"
                        type="text"
                        :hide-details="true"
                        :value="`${number18.to.yy}`"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
        <!-- Line 10 -->
        <v-row class="bb-1">
          <v-col cols="8" sm="8" md="8">
            <p>19. RESERVED FOR LOCAL USE</p>
            <v-text-field
              v-model="number19.value"
              placeholder="reserved for local use"
              type="text"
              :hide-details="true"
              :value="`${number17.value}`"
            ></v-text-field>
          </v-col>

          <v-col cols="4" sm="4" md="4" class="lb-1">
            <v-row>
              <v-col cols="6" md="6" sm="6">
                <p>20. OUTSIDE LAB?</p>
                <v-row align="center">
                  <v-checkbox
                    v-model="number20.yes"
                    :false-value="0"
                    :true-value="1"
                    :hide-details="true"
                    label="Yes"
                    @change="checkNumber20(0)"
                  >
                  </v-checkbox>
                  <v-checkbox
                    v-model="number20.no"
                    :false-value="0"
                    :true-value="1"
                    :hide-details="true"
                    label="No"
                    @change="checkNumber20(1)"
                  >
                  </v-checkbox>
                </v-row>
              </v-col>
              <v-col cols="6" md="6" sm="6">
                <p>$CHARGES</p>
                <v-row>
                  <v-col cols="6" md="6" sm="6" class="lb-1">
                    <v-text-field
                      v-model="number20.charges.first"
                      placeholder="enter"
                      type="text"
                      :hide-details="true"
                      :value="`${number20.charges.first}`"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" md="6" sm="6" class="lb-1">
                    <v-text-field
                      v-model="number20.charges.second"
                      placeholder="enter"
                      type="text"
                      :hide-details="true"
                      :value="`${number20.charges.second}`"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- Line 11 -->
        <v-row class="bb-1">
          <v-col cols="8" sm="8" md="8">
            <p>
              21. DIAGNOSIS OR NATURE OF ILLNESS OR INJURY (Relate Items 1, 2, 3
              or to item 24E by Line)
            </p>
            <v-row>
              <v-col
                v-for="(item, i) in number21.first"
                :key="'number21' + i"
                cols="6"
                sm="6"
                md="6"
              >
                <div class="d-flex flex-row align-center">
                  <p class="pt-5 mr-3">{{ `${i + 1}. ` }}</p>
                  <v-text-field
                    v-model="number21.first[i]"
                    placeholder=""
                    type="text"
                    :hide-details="true"
                    :value="`${item}`"
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                v-for="(item, i) in number21.second"
                :key="'number21' + (i + 2)"
                cols="6"
                sm="6"
                md="6"
              >
                <div class="d-flex flex-row align-center">
                  <p class="pt-5 mr-3">{{ `${i + 3}. ` }}</p>
                  <v-text-field
                    v-model="number21.second[i]"
                    placeholder=""
                    type="text"
                    :hide-details="true"
                    :value="`${item}`"
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" sm="4" md="4" class="lb-1">
            <p>22. MEDICAID RESUBMISSION</p>
            <v-row>
              <v-col cols="7" sm="7" md="7">
                <p>CODE</p>
                <v-text-field
                  v-model="number22.code"
                  placeholder="code"
                  type="text"
                  :hide-details="true"
                  :value="`${number22.code}`"
                ></v-text-field>
              </v-col>

              <v-col cols="5" sm="5" md="5" class="lb-1">
                <p>ORIGINAL.REF.NO</p>
                <v-text-field
                  v-model="number22.no"
                  placeholder="original ref no"
                  type="text"
                  :hide-details="true"
                  :value="`${number22.no}`"
                ></v-text-field>
              </v-col>
            </v-row>
            <p>23. PRIOR AUTHORIZATION NUMBER</p>
            <v-col>
              <v-text-field
                v-model="number23.value"
                placeholder="prior authorization number"
                type="text"
                :hide-details="true"
                :value="`${number23.value}`"
              ></v-text-field>
            </v-col>
          </v-col>
        </v-row>
        <!-- Line 12 -->
        <v-row class="bb-1">
          <v-col cols="8" sm="8" md="8">
            <v-row>
              <v-col cols="4" sm="4" md="4">
                <p>24. A. DATE(S) OF SERVICE</p>
                <v-row>
                  <v-col
                    cols="6"
                    md="6"
                    sm="6"
                    class="d-flex flex-column align-center"
                  >
                    <span>FROM</span>
                    <v-row align="center">
                      <v-col cols="4" md="4" sm="4   " class="p-0">
                        <p>MM</p>
                        <v-text-field
                          v-model="number24.a.mm"
                          placeholder="mm"
                          type="text"
                          :hide-details="true"
                          :value="`${number24.a.mm}`"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4" md="4" sm="4" class="p-0">
                        <p>DD</p>
                        <v-text-field
                          v-model="number24.a.dd"
                          placeholder="dd"
                          type="text"
                          :hide-details="true"
                          :value="`${number24.a.dd}`"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4" md="4" sm="4" class="p-0">
                        <p>YY</p>
                        <v-text-field
                          v-model="number24.a.yy"
                          placeholder="yy"
                          type="text"
                          :hide-details="true"
                          :value="`${number24.a.yy}`"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col
                    cols="6"
                    md="6"
                    sm="6"
                    class="d-flex flex-column align-center"
                  >
                    <span>TO</span>
                    <v-row align="center">
                      <v-col cols="4" md="4" sm="4   " class="p-0">
                        <p>MM</p>
                        <v-text-field
                          v-model="number18.to.mm"
                          placeholder="mm"
                          type="text"
                          :hide-details="true"
                          :value="`${number18.to.mm}`"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4" md="4" sm="4" class="p-0">
                        <p>DD</p>
                        <v-text-field
                          v-model="number18.to.dd"
                          placeholder="dd"
                          type="text"
                          :hide-details="true"
                          :value="`${number18.to.dd}`"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4" md="4" sm="4" class="p-0">
                        <p>YY</p>
                        <v-text-field
                          v-model="number18.to.yy"
                          placeholder="yy"
                          type="text"
                          :hide-details="true"
                          :value="`${number18.to.yy}`"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>

              <v-col
                cols="1"
                sm="1"
                md="1"
                class="d-flex flex-column align-center lb-1"
              >
                <p>B.</p>
                <p>PLACEOF</p>
                <p>SERVICE</p>
              </v-col>

              <v-col
                cols="1"
                sm="1"
                md="1"
                class="d-flex flex-column align-center lb-1"
              >
                <p>C.</p>
                <p>EMG</p>
              </v-col>

              <v-col cols="5" sm="5" md="5" class="d-flex flex-column lb-1">
                <div class="d-flex flex-column align-center">
                  <p>D. PROCEDURES, SERVICES, OR SUPPLIES</p>
                  <p>(Explain Unusual Circumstances)</p>
                </div>
                <v-row>
                  <v-col cols="8" sm="8" md="8">
                    <p>CPT/HCPCS</p>
                  </v-col>

                  <v-col cols="4" sm="4" md="4" class="lb-1">
                    <p>MODIFIER</p>
                  </v-col>
                </v-row>
              </v-col>

              <v-col
                cols="1"
                sm="1"
                md="1"
                class="d-flex flex-column align-center lb-1"
              >
                <p>E.</p>
                <p>DIAGNOSIS</p>
                <p>POINTER</p>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="4" sm="4" md="4" class="lb-1">
            <v-row>
              <v-col
                cols="3"
                sm="3"
                md="3"
                class="d-flex flex-column align-center"
              >
                <span>F.</span>
                <span>$ CHARGES</span>
              </v-col>

              <v-col
                cols="2"
                sm="2"
                md="2"
                class="d-flex flex-column align-center lb-1"
              >
                <p>G.</p>
                <p>DAYS</p>
                <p>OR</p>
                <p>UNITS</p>
              </v-col>

              <v-col
                cols="2"
                sm="2"
                md="2"
                class="d-flex flex-column align-center lb-1"
              >
                <p>H.</p>
                <p>EPSDT</p>
                <p>FAMILY</p>
                <p>PLAN</p>
              </v-col>

              <v-col
                cols="1"
                sm="1"
                md="1"
                class="d-flex flex-column align-center lb-1"
              >
                <p>I.</p>
                <p>ID.</p>
                <p>QUAL</p>
              </v-col>

              <v-col
                cols="4"
                sm="4"
                md="4"
                class="d-flex flex-column align-center lb-1"
              >
                <p>J.</p>
                <p>RENDERING</p>
                <p>PROVIDER ID. #</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- Line 13 -->
        <v-row v-for="(row, ii) in 6" :key="'numberstr' + ii" class="bb-1">
          <v-col cols="8" sm="8" md="8">
            <v-row>
              <v-col v-for="(col, n) in 14" :key="'numberstr' + ii + '-' + n">
                <v-text-field
                  v-model="strArray[ii][n]"
                  placeholder="enter"
                  type="text"
                  :hide-details="true"
                  :value="`${strArray[ii][n]}`"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="4" sm="4" md="4" class="lb-1">
            <v-row>
              <v-col v-for="(col2, n2) in 6" :key="'numberstr' + ii + '-' + n2">
                <v-text-field
                  v-model="strArray[ii][n2 + 14]"
                  placeholder="enter"
                  type="text"
                  :hide-details="true"
                  :value="`${strArray[ii][n2 + 14]}`"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- Line 14 -->
        <v-row class="bb-1">
          <v-col cols="8" sm="8" md="8">
            <v-row>
              <v-col cols="5" md="5" sm="5">
                <div class="d-flex flex-row">
                  <div class="d-flex flex-column">
                    <p>25. FEDERAL TAX I.D.NUMBER</p>
                    <!-- <v-text-field v-model="number25.value" placeholder="enter" type="text" :hide-details = true :value="`${number25.value}`"></v-text-field> -->
                    <p class="pt-5 bb-1">{{ $data.number25.value }}</p>
                  </div>

                  <div class="ml-auto">
                    <div class="d-flex flex-row">
                      <div class="d-flex flex-column">
                        <p>SSN</p>
                        <v-checkbox
                          v-model="number25.ssn"
                          :false-value="0"
                          :true-value="1"
                          :hide-details="true"
                          :disabled="true"
                          @change="checkNumber25(0)"
                        >
                        </v-checkbox>
                      </div>

                      <div class="d-flex flex-column">
                        <p>EIN</p>
                        <v-checkbox
                          v-model="number25.ein"
                          :false-value="0"
                          :true-value="1"
                          :hide-details="true"
                          :disabled="true"
                          @change="checkNumber25(1)"
                        >
                        </v-checkbox>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="4" md="4" sm="4" class="lb-1">
                <p>26. PATIENT'S ACCOUNT NO.</p>
                <!-- <v-text-field v-model="number26.value" placeholder="enter" type="text" :hide-details = true :value="`${number26.value}`"></v-text-field> -->
                <p class="pt-5 bb-1">{{ $data.number26.value }}</p>
              </v-col>
              <v-col cols="3" md="3" sm="3" class="lb-1">
                <p>27. PATIENT'S NAME(Last Name, First Name, Middle Initial)</p>
                <p>(For govt, claims see back)</p>
                <div class="d-flex flex-row">
                  <v-checkbox
                    v-model="number27.yes"
                    :false-value="0"
                    :true-value="1"
                    :hide-details="true"
                    label="Yes"
                    @change="checkNumber27(0)"
                  >
                  </v-checkbox>
                  <v-checkbox
                    v-model="number27.no"
                    :false-value="0"
                    :true-value="1"
                    :hide-details="true"
                    label="No"
                    @change="checkNumber27(1)"
                  >
                  </v-checkbox>
                </div>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="4" sm="4" md="4" class="lb-1">
            <v-row>
              <v-col>
                <p>28. TOTAL CHARGE</p>
                <v-text-field
                  v-model="number28.value"
                  placeholder="enter"
                  type="text"
                  :hide-details="true"
                  :value="`${number28.value}`"
                ></v-text-field>
              </v-col>
              <v-col class="lb-1">
                <p>29. AMOUNT PAID</p>
                <v-text-field
                  v-model="number29.value"
                  placeholder="enter"
                  type="text"
                  :hide-details="true"
                  :value="`${number29.value}`"
                ></v-text-field>
              </v-col>
              <v-col class="lb-1">
                <p>30. BALANCE DUE</p>
                <v-text-field
                  v-model="number30.value"
                  placeholder="enter"
                  type="text"
                  :hide-details="true"
                  :value="`${number30.value}`"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- Line 15 -->
        <v-row class="bb-1">
          <v-col cols="8" sm="8" md="8">
            <v-row>
              <v-col cols="5" md="5" sm="5">
                <div class="d-flex flex-row">
                  <div class="d-flex flex-column">
                    <p>
                      31. SIGNATURE OF PHYSICIAN OR SUPPLIER INCLUDING DEGREES
                      OR CREDENTIALS
                    </p>
                    <p>
                      (I certify that the statements on the reverse apply to
                      this bill and are made a part thereof.)
                    </p>
                    <!-- <v-text-field v-model="number31.value" placeholder="enter" type="text" :hide-details = true :value="`${number31.value}`"></v-text-field> -->
                    <p class="pt-5 bb-1">{{ $data.number31.value }}</p>
                  </div>
                </div>
              </v-col>
              <v-col cols="7" md="7" sm="7" class="lb-1">
                <div class="d-flex flex-column">
                  <p>32. SERVICE FACILITY LOCATION INFORMATION</p>
                  <!-- <v-text-field v-model="number32.value" placeholder="service facility location information" type="text" :hide-details = true :value="`${number32.value}`"></v-text-field> -->
                  <p class="pt-5 bb-1">{{ $data.number32.value }}</p>
                </div>

                <v-row>
                  <v-col cols="6" md="6" sm="6">
                    <div class="d-flex flex-row align-center">
                      <p class="pt-5 mr-3">a.</p>
                      <!-- <v-text-field v-model="number32.a" placeholder="enter" type="text" :hide-details = true :value="`${number32.a}`"></v-text-field> -->
                      <p class="pt-5 bb-1">{{ $data.number32.a }}</p>
                    </div>
                  </v-col>
                  <v-col cols="6" md="6" sm="6">
                    <div class="d-flex flex-row align-center">
                      <p class="pt-5 mr-3">b.</p>
                      <!-- <v-text-field v-model="number32.b" placeholder="enter" type="text" :hide-details = true :value="`${number32.b}`"></v-text-field> -->
                      <p class="pt-5 bb-1">{{ $data.number32.b }}</p>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="4" sm="4" md="4" class="lb-1">
            <div class="d-flex flex-column">
              <p>33. BILLING PROVIDER INFO & INFO & PH # ( )</p>
              <!-- <v-text-field v-model="number33.value" placeholder="service facility location information" type="text" :hide-details = true :value="`${number33.value}`"></v-text-field> -->
              <p class="pt-5 bb-1">{{ $data.number33.value }}</p>
            </div>

            <v-row>
              <v-col cols="6" md="6" sm="6">
                <div class="d-flex flex-row align-center">
                  <p class="pt-5 mr-3">a.</p>
                  <!-- <v-text-field v-model="number33.a" placeholder="enter" type="text" :hide-details = true :value="`${number33.a}`"></v-text-field> -->
                  <p class="pt-5 bb-1">{{ $data.number33.a }}</p>
                </div>
              </v-col>
              <v-col cols="6" md="6" sm="6">
                <div class="d-flex flex-row align-center">
                  <p class="pt-5 mr-3">b.</p>
                  <!-- <v-text-field v-model="number33.b" placeholder="enter" type="text" :hide-details = true :value="`${number33.b}`"></v-text-field> -->
                  <p class="pt-5 bb-1">{{ $data.number33.b }}</p>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import userRoleMixin from '~/mixins/userRoleMixin'
import inputMixin from '~/mixins/inputMixin'
import authMixin from '~/mixins/authMixin'
import uploadMixin from '~/mixins/uploadMixin'

export default {
  mixins: [userRoleMixin, inputMixin, authMixin, uploadMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  data() {
    return {
      hcfa: {
        hcfaTitle: {
          pNo: 1500,
          line1: 'HEALTH INSURANCE CLAIM FORM',
          line2: 'APPROVED BY NATIONAL UNIFORM CLAIM COMMITTEE 08/05',
          line6: '6. PATIENT RELATIONSHIP TO INSURED',
          line8: '8. PATIENT STATUS',
          line10: "10. IS PATIENT'S CONDITION RELATED TO:",
        },
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery',
        ],
      },
      line1: [
        {
          name: 'MEDICARE',
          checkValue: '(Medicare #)',
        },
        {
          name: 'MEDICAID',
          checkValue: '(Medicaid #)',
        },
        {
          name: 'TRICARE CHAMPUS',
          checkValue: "(Sonsor's SSN)",
        },
        {
          name: 'CHAMPVA',
          checkValue: '(Member ID#)',
        },
        {
          name: 'GROUP HEALTH PLAN',
          checkValue: '(SSN or ID)',
        },
        {
          name: 'FECA BLK LUNG',
          checkValue: '(SSN)',
        },
        {
          name: 'OTHER',
          checkValue: '(ID)',
        },
      ],
      line6: [
        {
          checkValue: 'Self',
        },
        {
          checkValue: 'Spouse',
        },
        {
          checkValue: 'Child',
        },
        {
          checkValue: 'Other',
        },
      ],
      line8: {
        first: [
          { checkValue: 'Single' },
          { checkValue: 'Married' },
          { checkValue: 'Other' },
        ],
        second: [
          { checkValue: 'Employed' },
          { checkValue: 'Full-Time Student' },
          { checkValue: 'Part-Time Student' },
        ],
      },
      line10: [
        {
          value: 'a. EMPLOYMENT? (Current or Previous)',
        },
        {
          value: 'b. AUTO ACCIDENT?',
        },
        {
          value: 'c. OTHER ACCIDENT?',
        },
      ],
      line28: [
        { name: 'TOTAL CHARGE' },
        { name: 'AMOUNT PAID' },
        { name: 'BALANCE DUE' },
      ],
      number1: [0, 0, 0, 0, 0, 0, 0, ''],
      number2: { patientName: '' },
      number3: { mm: '', dd: '', yy: '', sex: { male: 0, female: 0 } },
      number4: { insuredName: '' },
      number5: {
        patientAddress: '',
        patientCity: '',
        patientState: '',
        patientZipcode: '',
        patientTelephone: '',
      },
      number6: [0, 0, 0, 0],
      number7: {
        insuredAddress: '',
        insuredCity: '',
        insuredState: '',
        insuredZipcode: '',
        insuredTelephone: '',
      },
      number8: [0, 0, 0, 0, 0, 0],
      number9: {
        value: '',
        a: '',
        b: {
          mm: '',
          dd: '',
          yy: '',
          sex: {
            male: 0,
            female: 0,
          },
        },
        c: '',
        d: '',
      },
      number10: {
        value: '',
        a: {
          yes: 0,
          no: 0,
        },
        b: {
          yes: 0,
          no: 0,
          place: '',
        },
        c: {
          yes: 0,
          no: 0,
        },
        d: '',
      },
      number11: {
        value: '',
        a: {
          mm: '',
          dd: '',
          yy: '',
          sex: {
            male: 0,
            female: 0,
          },
        },
        b: '',
        c: '',
        d: {
          yes: 0,
          no: 0,
        },
      },
      number12: {
        signed: '',
        date: '',
      },
      number13: {
        value: '',
      },
      number14: {
        mm: '',
        dd: '',
        yy: '',
        sex: {
          male: 0,
          female: 0,
        },
      },
      number15: {
        mm: '',
        dd: '',
        yy: '',
        sex: {
          male: 0,
          female: 0,
        },
      },
      number16: {
        from: {
          mm: '',
          dd: '',
          yy: '',
          sex: {
            male: 0,
            female: 0,
          },
        },
        to: {
          mm: '',
          dd: '',
          yy: '',
          sex: {
            male: 0,
            female: 0,
          },
        },
      },
      number17: {
        value: '',
        a: {
          first: '',
          second: '',
        },
        b: '',
      },
      number18: {
        from: {
          mm: '',
          dd: '',
          yy: '',
          sex: {
            male: 0,
            female: 0,
          },
        },
        to: {
          mm: '',
          dd: '',
          yy: '',
          sex: {
            male: 0,
            female: 0,
          },
        },
      },
      number19: {
        value: '',
      },
      number20: {
        yes: 0,
        no: 0,
        charges: {
          first: '',
          second: '',
        },
      },
      number21: {
        first: [0, 0],
        second: [0, 0],
      },
      number22: {
        code: '',
        no: '',
      },
      number23: {
        value: '',
      },
      number24: {
        a: {
          from: { mm: '', dd: '', yy: '' },
          to: { mm: '', dd: '', yy: '' },
        },
        b: '',
        c: '',
        d: { cpt: '', modifier: '' },
        e: '',
        f: '',
        g: '',
        h: '',
        i: '',
        j: '',
      },
      number25: {
        value: '',
        ssn: 0,
        ein: 0,
      },
      number26: {
        value: '',
      },
      number27: {
        yes: 0,
        no: 0,
      },
      number28: {
        value: '',
      },
      number29: {
        value: '',
      },
      number30: {
        value: '',
      },
      number31: {
        value: '',
      },
      number32: {
        value: '',
        a: '',
        b: '',
      },
      number33: {
        value: '',
        a: '',
        b: '',
      },

      strArray: [
        [
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ],
        [
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ],
        [
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ],
        [
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ],
        [
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ],
        [
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ],
      ],
      isLoading: true,
      patientList: [],
      patientIdList: [],
      currentName: {
        user_uuid: null,
        user_last_name: null,
        user_first_name: null,
      },
      isOpen: false,
    }
  },

  mounted() {
    this.init()
   this.$userApi
      .get(`/list?view=users`)
      .then((res) => {
        if (res?.status === 200 && res.data) {
          this.patientList = res.data.map((x) => {
            return {
              patientName: x.user_first_name + ' ' + x.user_last_name,
              ...x,
            }
          })
        }
      })
      .catch(() => {
        this.$toast.error('loading error')
      })
  },
  methods: {
    openHcfa() {
      this.init()
      if (this.currentName === null || this.currentName?.user_uuid === null)
        return
      this.$insuranceApi
        .get(
          `/hcfa/?id=${this.$auth.user.uuid}&patientId=${this.currentName.user_uuid}`
        )
        .then((res) => {
          console.log('response', res.status, res.data)
          if (res?.status === 200 && res.data) {
            if (res.data.hcfa_info) {
              const info = res.data.hcfa_info
              this.number1 = info.number1
              this.number8 = info.number8
              this.number9 = info.number9
              this.number10 = info.number10
              this.number11 = info.number11
              this.number14 = info.number14
              this.number15 = info.number15
              this.number16 = info.number16
              this.number18 = info.number18
              this.number19 = info.number19
              this.number20 = info.number20
              this.number21 = info.number21
              this.number22 = info.number22
              this.number23 = info.number23
              this.number24 = info.number24
              this.number27 = info.number27
              this.number28 = info.number28
              this.number29 = info.number29
              this.number30 = info.number30
              this.number11 = info.number11
              this.strArray = info.strArray
            }

            if (res.data && res.data.claims_info) {
              const claimsInfo = res.data.claims_info
              this.number25.value = claimsInfo.number25.value
              if (claimsInfo.number25.selectedValue === 'ein') {
                this.number25.ssn = 0
                this.number25.ein = 1
              } else {
                this.number25.ssn = 1
                this.number25.ein = 0
              }
              this.number26 = claimsInfo.number26
              this.number31 = claimsInfo.number31
              this.number32 = claimsInfo.number32
              this.number33 = claimsInfo.number33
            }

            if (res.data && res.data.insured_info) {
              const insuredInfo = res.data.insured_info
              this.number4 = insuredInfo.number4
              this.number5 = insuredInfo.number5
              for (let i = 0; i < 4; i++) {
                if (this.line6[i].checkValue === insuredInfo.number6) {
                  this.number6[i] = 1
                } else {
                  this.number6[i] = 0
                }
              }
              this.number7 = insuredInfo.number7
              this.number11.a.mm = insuredInfo.number11.a.mm
              this.number11.a.dd = insuredInfo.number11.a.dd
              this.number11.a.yy = insuredInfo.number11.a.yy
              if (insuredInfo.number11.a.sex === 'female') {
                this.number11.a.sex.female = 1
                this.number11.a.sex.male = 0
              } else {
                this.number11.a.sex.female = 0
                this.number11.a.sex.male = 1
              }
              this.number11.c = insuredInfo.number11.c

              this.number12 = insuredInfo.number12
              this.number13 = insuredInfo.number13
              this.number17 = insuredInfo.number17
            }
            // const doctorInfo = res.data.doctor;
            const patientInfo = res.data.patient
            this.number2.patientName =
              patientInfo.user_last_name + ' ' + patientInfo.user_first_name
            const dateArray = patientInfo?.user_date_of_birth?.split('-')
            this.number3.mm = dateArray[0]
            this.number3.dd = dateArray[1]
            this.number3.yy = dateArray[2]?.split('T')[0]
          } else {
            this.init()
          }
        })
        .catch((error) => {
          console.log(error)
          // this.$toast.error('loading error')
        })
      this.isLoading = false
    },

    checkNumber1(index) {
      for (let i = 0; i <= 6; i++) {
        if (index === i) {
          this.number1[i] = 1
        } else {
          this.number1[i] = 0
        }
      }
    },

    checkNumber3(index) {
      if (index === 0) {
        this.number3.sex.male = 1
        this.number3.sex.female = 0
      } else {
        this.number3.sex.male = 0
        this.number3.sex.female = 1
      }
    },

    checkNumber6(index) {
      for (let i = 0; i < 4; i++) {
        if (index === i) {
          this.number6[i] = 1
        } else {
          this.number6[i] = 0
        }
      }
    },

    checkNumber8(index) {
      for (let i = 0; i < 6; i++) {
        if (index === i) {
          this.number8[i] = 1
        } else {
          this.number8[i] = 0
        }
      }
    },

    checkNumber9(index) {
      if (index === 0) {
        this.number9.b.sex.male = 1
        this.number9.b.sex.female = 0
      } else {
        this.number9.b.sex.male = 0
        this.number9.b.sex.female = 1
      }
    },

    checkNumber10(index) {
      if (index === 0) {
        this.number10.a.yes = 1
        this.number10.a.no = 0
      } else if (index === 1) {
        this.number10.a.yes = 0
        this.number10.a.no = 1
      } else if (index === 2) {
        this.number10.b.yes = 1
        this.number10.b.no = 0
      } else if (index === 3) {
        this.number10.b.yes = 0
        this.number10.b.no = 1
      } else if (index === 4) {
        this.number10.c.yes = 1
        this.number10.c.no = 0
      } else {
        this.number10.c.yes = 0
        this.number10.c.no = 1
      }
    },

    checkNumber11(index) {
      if (index === 0) {
        this.number11.a.sex.male = 1
        this.number11.a.sex.female = 0
      } else if (index === 1) {
        this.number11.a.sex.male = 0
        this.number11.a.sex.female = 1
      } else if (index === 2) {
        this.number11.d.yes = 1
        this.number11.d.no = 0
      } else {
        this.number11.d.yes = 0
        this.number11.d.no = 1
      }
    },

    checkNumber14(index) {
      if (index === 0) {
        this.number14.sex.male = 1
        this.number14.sex.female = 0
      } else {
        this.number14.sex.male = 0
        this.number14.sex.female = 1
      }
    },

    checkNumber20(index) {
      if (index === 0) {
        this.number20.yes = 1
        this.number20.no = 0
      } else {
        this.number20.yes = 0
        this.number20.no = 1
      }
    },

    checkNumber25(index) {
      if (index === 0) {
        this.number25.ssn = 1
        this.number25.ein = 0
      } else {
        this.number25.ssn = 0
        this.number25.ein = 1
      }
    },

    checkNumber27(index) {
      if (index === 0) {
        this.number27.yes = 1
        this.number27.no = 0
      } else {
        this.number27.yes = 0
        this.number27.no = 1
      }
    },

    init() {
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 20; j++) {
          this.strArray[i][j] = ''
        }
      }
      this.number1 = [0, 0, 0, 0, 0, 0, 0, '']
      this.number2 = { patientName: '' }
      this.number3 = { mm: '', dd: '', yy: '', sex: { male: 0, female: 0 } }
      this.number4 = { insuredName: '' }
      this.number5 = {
        patientAddress: '',
        patientCity: '',
        patientState: '',
        patientZipcode: '',
        patientTelephone: '',
      }
      this.number6 = [0, 0, 0, 0]
      this.number7 = {
        insuredAddress: '',
        insuredCity: '',
        insuredState: '',
        insuredZipcode: '',
        insuredTelephone: '',
      }
      this.number8 = [0, 0, 0, 0, 0, 0]
      this.number9 = {
        value: '',
        a: '',
        b: {
          mm: '',
          dd: '',
          yy: '',
          sex: {
            male: 0,
            female: 0,
          },
        },
        c: '',
        d: '',
      }
      this.number10 = {
        value: '',
        a: {
          yes: 0,
          no: 0,
        },
        b: {
          yes: 0,
          no: 0,
          place: '',
        },
        c: {
          yes: 0,
          no: 0,
        },
        d: '',
      }
      this.number11 = {
        value: '',
        a: {
          mm: '',
          dd: '',
          yy: '',
          sex: {
            male: 0,
            female: 0,
          },
        },
        b: '',
        c: '',
        d: {
          yes: 0,
          no: 0,
        },
      }
      this.number12 = {
        signed: '',
        date: '',
      }
      this.number13 = {
        value: '',
      }
      this.number14 = {
        mm: '',
        dd: '',
        yy: '',
        sex: {
          male: 0,
          female: 0,
        },
      }
      this.number15 = {
        mm: '',
        dd: '',
        yy: '',
        sex: {
          male: 0,
          female: 0,
        },
      }
      this.number16 = {
        from: {
          mm: '',
          dd: '',
          yy: '',
          sex: {
            male: 0,
            female: 0,
          },
        },
        to: {
          mm: '',
          dd: '',
          yy: '',
          sex: {
            male: 0,
            female: 0,
          },
        },
      }
      this.number17 = {
        value: '',
        a: {
          first: '',
          second: '',
        },
        b: '',
      }
      this.number18 = {
        from: {
          mm: '',
          dd: '',
          yy: '',
          sex: {
            male: 0,
            female: 0,
          },
        },
        to: {
          mm: '',
          dd: '',
          yy: '',
          sex: {
            male: 0,
            female: 0,
          },
        },
      }
      this.number19 = {
        value: '',
      }
      this.number20 = {
        yes: 0,
        no: 0,
        charges: {
          first: '',
          second: '',
        },
      }
      this.number21 = {
        first: ['', ''],
        second: ['', ''],
      }
      this.number22 = {
        code: '',
        no: '',
      }
      this.number23 = {
        value: '',
      }
      this.number24 = {
        a: {
          from: { mm: '', dd: '', yy: '' },
          to: { mm: '', dd: '', yy: '' },
        },
        b: '',
        c: '',
        d: { cpt: '', modifier: '' },
        e: '',
        f: '',
        g: '',
        h: '',
        i: '',
        j: '',
      }
      this.number25 = {
        value: '',
        ssn: 0,
        ein: 0,
      }
      this.number26 = {
        value: '',
      }
      this.number27 = {
        yes: 0,
        no: 0,
      }
      this.number28 = {
        value: '',
      }
      this.number29 = {
        value: '',
      }
      this.number30 = {
        value: '',
      }
      this.number31 = {
        value: '',
      }
      this.number32 = {
        value: '',
        a: '',
        b: '',
      }
      this.number33 = {
        value: '',
        a: '',
        b: '',
      }
    },

    download(strData, strFileName, strMimeType) {
      const D = document
      const A = arguments
      const a = D.createElement('a')
      const n = A[1]

      // build download link:
      a.href = 'data:' + strMimeType + 'charset=utf-8,' + escape(strData)

      if ('download' in a) {
        // FF20, CH19
        a.setAttribute('download', n)
        a.innerHTML = 'downloading...'
        D.body.appendChild(a)
        setTimeout(function () {
          const e = D.createEvent('MouseEvents')
          e.initMouseEvent(
            'click',
            true,
            false,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
          )
          a.dispatchEvent(e)
          D.body.removeChild(a)
        }, 66)
        return true
      } /* end if('download' in a) */

      // do iframe dataURL download: (older W3)
      const f = D.createElement('iframe')
      D.body.appendChild(f)
      f.src =
        'data:' +
        (A[2] ? A[2] : 'application/octet-stream') +
        (window.btoa ? ';base64' : '') +
        ',' +
        (window.btoa ? window.btoa : escape)(strData)
      setTimeout(function () {
        D.body.removeChild(f)
      }, 333)
      return true
    },

    makeXml() {
      let xmlbody =
        '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE base>\n<base>\n\t'

      // Line 1
      xmlbody =
        xmlbody +
        '<number1>\n\t\t<medicare>' +
        this.number1[0] +
        '</medicare>\n\t\t<medicaid>' +
        this.number1[1] +
        '</medicaid>\n\t\t<sensor>' +
        this.number1[2] +
        '</sensor>\n\t\t<memeberid>' +
        this.number1[3] +
        '</memeberid>\n\t\t<ssnid>' +
        this.number1[4] +
        '</ssnid>\n\t\t<ssn>' +
        this.number1[5] +
        '</ssn>\n\t\t<id>' +
        this.number1[6] +
        '</id>\n\t\t<number1a>' +
        this.number1[this.number1.length - 1] +
        '</number1a>\n\t</number1>\n\t'
      // Line 2
      xmlbody =
        xmlbody + '<number2>' + this.number2.patientName + '</number2>\n\t'
      xmlbody =
        xmlbody +
        '<number3>\n\t\t<month>' +
        this.number3.mm +
        '</month>\n\t\t<day>' +
        this.number3.dd +
        '</day>\n\t\t<year>' +
        this.number3.yy +
        '</year>\n\t\t<sex>\n\t\t<male>' +
        this.number3.sex.male +
        '</male>\n\t\t\t<female>' +
        this.number3.sex.female +
        '</female>\n\t\t</sex>\n\t</number3>\n\t'
      xmlbody =
        xmlbody + '<number4>' + this.number4.insuredName + '</number4>\n\t'
      // Line 3
      xmlbody =
        xmlbody +
        '<number5>\n\t\t<patientaddress>' +
        this.number5.patientAddress +
        '</patientaddress>\n\t\t<patientcity>' +
        this.number5.patientCity +
        '</patientcity>\n\t\t<patientstate>' +
        this.number5.patientCity +
        '</patientstate>\n\t\t<patientzipcode>' +
        this.number5.patientZipcode +
        '</patientzipcode>\n\t\t<patienttelephone>' +
        this.number5.patientTelephone +
        '</patienttelephone>\n\t</number5>\n\t'
      xmlbody =
        xmlbody +
        '<number6>\n\t\t<self>' +
        this.number6[0] +
        '</self>\n\t\t<supose>' +
        this.number6[1] +
        '</supose>\n\t\t<child>' +
        this.number6[2] +
        '</child>\n\t\t<other>' +
        this.number6[3] +
        '</other>\n\t</number6>\n\t'
      xmlbody =
        xmlbody +
        '<number7>\n\t\t<insuredaddress>' +
        this.number5.insuredAddress +
        '</insuredaddress>\n\t\t<insuredcity>' +
        this.number5.insuredCity +
        '</insuredcity>\n\t\t<insuredstate>' +
        this.number5.insuredState +
        '</insuredstate>\n\t\t<insuredzipcode>' +
        this.number5.insuredZipcode +
        '</insuredzipcode>\n\t\t<insuredtelephone>' +
        this.number5.insuredTelephone +
        '</insuredtelephone>\n\t</number7>\n\t'
      // Line 4
      xmlbody =
        xmlbody +
        '<number8>\n\t\t<single>' +
        this.number8[0] +
        '</single>\n\t\t<married>' +
        this.number8[1] +
        '</married>\n\t\t<other>' +
        this.number8[2] +
        '</other>\n\t\t<employed>' +
        this.number8[3] +
        '</employed>\n\t\t<fulltimestudent>' +
        this.number8[4] +
        '</fulltimestudent>\n\t\t<parttimestudent>' +
        this.number8[5] +
        '</parttimestudent>\n\t</number8>\n\t'
      // Line 5
      xmlbody =
        xmlbody +
        '<number9>\n\t\t<value>' +
        this.number9.value +
        '</value>\n\t\t<a>' +
        this.number9.a +
        '</a>\n\t\t<b>\n\t\t\t<month>' +
        this.number9.b.mm +
        '</month>\n\t\t\t<day>' +
        this.number9.b.dd +
        '</day>\n\t\t\t<year>' +
        this.number9.b.yy +
        '</year>\n\t\t\t<sex>\n\t\t\t\t<male>' +
        this.number9.b.sex.male +
        '</male>\n\t\t\t\t<female>' +
        this.number9.b.sex.female +
        '</female>\n\t\t\t</sex>\n\t\t</b>\n\t\t<c>' +
        this.number9.c +
        '</c>\n\t\t<d>' +
        this.number9.d +
        '</d>\n\t</number9>\n'
      // Line 6
      xmlbody =
        xmlbody +
        '\t<number10>\n\t\t<value>' +
        this.number10.value +
        '</value>\n\t\t<a>\n\t\t\t<yes>' +
        this.number10.a.yes +
        '</yes>\n\t\t\t<no>' +
        this.number10.a.no +
        '</no>\n\t\t</a>\n\t\t<b>\n\t\t\t<yes>' +
        this.number10.b.yes +
        '</yes>\n\t\t\t<no>' +
        this.number10.b.no +
        '</no>\n\t\t\t<place>' +
        this.number10.b.place +
        '</place>\n\t\t</b>\n\t\t<c>\n\t\t\t<yes>' +
        this.number10.c.yes +
        '</yes>\n\t\t\t<no>' +
        this.number10.c.no +
        '</no>\n\t\t</c>\n\t</number10>\n\t'
      // Line 7
      xmlbody =
        xmlbody +
        '<number11>\n\t\t<value>' +
        this.number11.value +
        '</value>\n\t\t<a>\n\t\t\t<month>' +
        this.number11.a.mm +
        '</month>\n\t\t\t<day>' +
        this.number11.a.dd +
        '</day>\n\t\t\t<year>' +
        this.number11.a.yy +
        '</year>\n\t\t\t<sex>\n\t\t\t\t<male>' +
        this.number11.a.sex.male +
        '</male>\n\t\t\t\t<female>' +
        this.number11.a.sex.female +
        '</female>\n\t\t\t</sex>\n\t\t</a>\n\t\t<b>' +
        this.number11.b +
        '</b>\n\t\t<c>' +
        this.number11.c +
        '</c>\n\t\t<d>\n\t\t\t<yes>' +
        this.number11.d.yes +
        '</yes>\n\t\t\t<no>' +
        this.number11.d.yes +
        '</no>\n\t\t</d>\n\t</number11>\n\t'
      // Line 8
      xmlbody =
        xmlbody +
        '<number12>\n\t\t<signed>' +
        this.number12.signed +
        '</signed>\n\t\t<date>' +
        this.number12.date +
        '</date>\n\t</number12>\n\t'
      // Line 9
      xmlbody = xmlbody + '<number13>' + this.number13.value + '</number13>\n\t'

      // Line 10
      xmlbody =
        xmlbody +
        '<number14>\n\t\t<month>' +
        this.number14.mm +
        '</month>\n\t\t<day>' +
        this.number14.dd +
        '</day>\n\t\t<year>' +
        this.number14.yy +
        '</year>\n\t\t<sex>\n\t\t\t<male>' +
        this.number14.sex.male +
        '</female>\n\t\t</sex>\n\t</number14>\n\t'

      // Line 11
      xmlbody =
        xmlbody +
        '<number15>\n\t\t<month>' +
        this.number15.mm +
        '</month>\n\t\t<day>' +
        this.number15.dd +
        '</day>\n\t\t<year>' +
        this.number15.yy +
        '</year>\n\t</number15>\n\t'

      // Line 12
      xmlbody =
        xmlbody +
        '<number16>\n\t\t<from>\n\t\t\t<month>' +
        this.number16.from.mm +
        '</month>\n\t\t\t<day>' +
        this.number16.from.dd +
        '</day>\n\t\t\t<year>' +
        this.number16.from.yy +
        '</year>\n\t\t</from>\n\t\t<to>\n\t\t\t<month>' +
        this.number16.to.mm +
        '</month>\n\t\t\t<day>' +
        this.number16.to.dd +
        '</day>\n\t\t\t<year>' +
        this.number16.to.yy +
        '</year>\n\t\t</to>\n\t</number16>\n\t'

      // Line 13
      xmlbody =
        xmlbody +
        '<number17>\n\t\t<value>' +
        this.number17.value +
        '</value>\n\t\t<a>\n\t\t\t<first>' +
        this.number17.value +
        '</first>\n\t\t\t<second>' +
        this.number17.a.first +
        '</second>\n\t\t</a>\n\t\t<b>' +
        this.number17.b +
        '</b>\n\t</number17>\n\t'

      // Line 14
      xmlbody =
        xmlbody +
        '<number18>\n\t\t<from>\n\t\t\t<month>' +
        this.number18.from.mm +
        '</month>\n\t\t\t<day>' +
        this.number18.from.dd +
        '</day>\n\t\t\t<year>' +
        this.number18.from.yy +
        '</year>\n\t\t</from>\n\t\t<to>\n\t\t\t<month>' +
        this.number18.to.mm +
        '</month>\n\t\t\t<day>' +
        this.number18.to.dd +
        '</day>\n\t\t\t<year>' +
        this.number18.to.yy +
        '</year>\n\t\t</to>\n\t</number18>\n\t'

      // Line 15
      xmlbody = xmlbody + '<number19>' + this.number19.value + '</number19>\n\t'

      // Line 16
      xmlbody =
        xmlbody +
        '<number20>\n\t\t<yes>' +
        this.number20.yes +
        '</yes>\n\t\t<no>' +
        this.number20.no +
        '</no>\n\t\t<charges>\n\t\t\t<first>' +
        this.number20.charges.first +
        '</first>\n\t\t\t<seconde>' +
        this.number20.charges.second +
        '</seconde>\n\t\t</charges>\n\t</number20>\n\t'

      // Line 17
      xmlbody =
        xmlbody +
        '<number21>\n\t\t<first>' +
        this.number21.first[0] +
        '</first>\n\t\t<second>' +
        this.number21.first[1] +
        '</second>\n\t\t<third>' +
        this.number21.second[0] +
        '</third>\n\t\t<fourth>' +
        this.number21.second[1] +
        '</fourth>\n\t</number21>\n\t'

      // Line 18
      xmlbody =
        xmlbody +
        '<number22>\n\t\t<code>' +
        this.number22.code +
        '</code>\n\t\t<no>' +
        this.number22.no +
        '</no>\n\t</number22>\n\t'

      // Line 19
      xmlbody = xmlbody + '<number23>' + this.number23.value + '</number23>\n\t'

      // Line 20
      xmlbody =
        xmlbody +
        '<number24>\n\t\t<from>\n\t\t\t<month>' +
        this.number24.a.from.mm +
        '</month>\n\t\t\t<day>' +
        this.number24.a.from.dd +
        '</day>\n\t\t\t<year>' +
        this.number24.a.from.yy +
        '</year>\n\t\t</from>\n\t\t<to>\n\t\t\t<month>' +
        this.number24.a.to.mm +
        '</month>\n\t\t\t<day>' +
        this.number24.a.to.dd +
        '</day>\n\t\t\t<year>' +
        this.number24.a.to.yy +
        '</year>\n\t\t</to>\n\t</number24>\n\t'

      // Line 22
      xmlbody =
        xmlbody +
        '<number25>\n\t\t<value>' +
        this.number25.value +
        '</value>\n\t\t<ssn>' +
        this.number25.ssn +
        '</ssn>\n\t\t<ein>' +
        this.number25.ein +
        '</ein>\n\t</number25>\n\t'

      // Line 23
      xmlbody = xmlbody + '<number26>' + this.number26.value + '</number26>\n\t'

      // Line 24
      xmlbody =
        xmlbody +
        '<number27>\n\t\t<yes>' +
        this.number27.yes +
        '</yes>\n\t\t<no>' +
        this.number12.no +
        '</no>\n\t</number27>\n\t'

      // Line 25
      xmlbody = xmlbody + '<number28>' + this.number28.value + '</number28>\n\t'

      // Line 26
      xmlbody = xmlbody + '<number29>' + this.number29.value + '</number29>\n\t'

      // Line 27
      xmlbody = xmlbody + '<number30>' + this.number30.value + '</number30>\n\t'

      // Line 28
      xmlbody = xmlbody + '<number31>' + this.number31.value + '</number31>\n\t'

      // Line 29
      xmlbody =
        xmlbody +
        '<number32>\n\t\t<value>' +
        this.number32.value +
        '</value>\n\t\t<a>' +
        this.number32.a +
        '</a>\n\t\t<b>' +
        this.number32.b +
        '</b>\n\t</number32>\n\t'

      // Line 30
      xmlbody =
        xmlbody +
        '<number33>\n\t\t<value>' +
        this.number33.value +
        '</value>\n\t\t<a>' +
        this.number33.a +
        '</a>\n\t\t<b>' +
        this.number33.b +
        '</b>\n\t</number33>\n\t'

      xmlbody += '</base>\n'
      return xmlbody
    },

    export2xml() {
      const data = this.makeXml()
      if (data)
        this.download(
          data,
          new Date().getTime() + '.xml',
          'application/octet-stream'
        )
    },

    async created() {
      // POST request using axios with async/await
      const sendingData = {
        id: this.$auth.user.uuid,
        patientId: this.currentName.user_uuid,
        hcfaInfo: {
          number1: this.number1,
          number8: this.number8,
          number9: this.number9,
          number10: this.number10,
          number11: this.number11,
          number14: this.number14,
          number15: this.number15,
          number16: this.number16,
          number18: this.number18,
          number19: this.number19,
          number20: this.number20,
          number21: this.number21,
          number22: this.number22,
          number23: this.number23,
          number24: this.number24,
          number27: this.number27,
          number28: this.number28,
          number29: this.number29,
          number30: this.number30,
          strArray: this.strArray,
        },
      }
      const response = await this.$insuranceApi.post('/hcfa/save', sendingData)
      console.log(response)
      if (response.status === 200) this.$toast.success('save success')
      else this.$toast.error('save error')
    },
    savehcfa() {
      this.created()
    },
  },
}
</script>

<style scoped>
* {
  color: black;
  font-weight: 500;
  font-size: 13px;
}
.hcfa-container {
  border: 1px solid black;
}

.ml-3 {
  margin-left: 5px;
}

.lb-1 {
  border-left: 1px solid black;
}

.bb-1 {
  border-bottom: 1px solid black;
}

.p-0 {
  padding: 0px 10px 0px 0px;
}

.p-none {
  padding: 0px;
}

.block {
  padding: 0px 0px 10px 0px;
  height: 70px;
}

.double-block {
  height: 140px;
}

.fourth-block {
  height: 280px;
}

.row {
  margin: 0px;
}

.row + .row {
  margin: 0px;
}

.input__control {
  margin: 0px;
  padding: 0px;
}

p {
  padding: 0px;
  margin: 0px;
}

.w-25 {
  width: 25;
}

.custome-input input {
  margin: 0px;
  padding: 0px;
}

.f-11 {
  font-size: 11px !important;
}

.v-text-field {
  padding: 0px;
  margin: 0px;
}
.v-text-field input {
  padding: 0px;
}

.v-text-field__details {
  display: none !important;
}

.v-input--selection-controls {
  margin-top: 0px !important;
}
</style>
