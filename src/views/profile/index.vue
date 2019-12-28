<template>
  <div class="dashboard">
    <v-snackbar v-model="snackbar" :timeout="4000" top :color="color">
        <span>{{message}}</span>
    </v-snackbar>
    <v-dialog 
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
        v-model="profileDialog">
        <v-card>
            <v-toolbar
            flat
            dark
            class="secondary"
        >
            <v-spacer></v-spacer>
            <v-toolbar-title>Edit Profile</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
            icon
            dark
            @click="profileDialog = false"
            >
            <v-icon>close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-layout column>
                <div>
                    <p class="title"><b>Basic</b></p>
                    <v-flex xs12>
                        <v-text-field
                            v-model="profile.fname"
                            :rules="inputRules"
                            prepend-inner-icon="person"
                            name="fname"
                            label="First Name"
                            outline
                            class="text_field_2"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                            v-model="profile.lname"
                            :rules="inputRules"
                            prepend-inner-icon="person"
                            name="lname"
                            label="Last Name"
                            outline
                            class="text_field_2 mt-2"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                            v-model="profile.email"
                            :rules="inputRules"
                            prepend-inner-icon="mail"
                            name="email"
                            label="E-mail"
                            outline
                            class="text_field_2 mt-2"
                        ></v-text-field>
                    </v-flex>
                </div>
                <v-divider class="my-4"></v-divider>
                <div v-if="$can('health_worker_profile')">
                    <p class="title"><b>Professional</b></p>
                </div>
                <v-flex xs12>
                    <v-select
                        v-model="profile.gender_id"
                        :rules="inputRules"
                        :items="genders"
                        item-value="id"
                        item-text="name"
                        prepend-inner-icon="accessibility"
                        name="gender"
                        label="Gender"
                        required
                        class="text_field_2 mt-2"
                        outline
                    ></v-select>
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                        v-model="profile.id_number"
                        :rules="inputRules"
                        prepend-inner-icon="credit_card"
                        name="id_number"
                        label="ID Number"
                        outline
                        class="text_field_2 mt-2"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-select
                        v-model="profile.worker_category_id"
                        :rules="inputRules"
                        :items="allWorkerCategories"
                        item-value="id"
                        item-text="name"
                        prepend-inner-icon="assignment_ind"
                        name="job_group"
                        label="Job Group"
                        required
                        class="text_field_2 mt-2"
                        outline
                        @input="updateSubCategory"
                    ></v-select>
                </v-flex>
                <v-flex xs12>
                    <v-select
                        v-if="getProfile.health_worker_profile != null"
                        v-model="profile.worker_sub_category_id"
                        :rules="inputRules"
                        :items="subjobs.worker_sub_category"
                        item-value="id"
                        item-text="name"
                        prepend-inner-icon="assignment_turned_in"
                        name="job_sub_group"
                        label="Job Sub-Group"
                        required
                        class="text_field_2 mt-2"
                        outline
                    ></v-select>
                    <v-select
                        v-else
                        v-model="profile.worker_sub_category_id"
                        :rules="inputRules"
                        :items="workerSubCategories"
                        item-value="id"
                        item-text="name"
                        prepend-inner-icon="assignment_turned_in"
                        name="job_sub_group"
                        label="Job Sub-Group"
                        required
                        class="text_field_2 mt-2"
                        outline
                    ></v-select>
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                        v-model="profile.licence_number"
                        :rules="inputRules"
                        prepend-inner-icon="chrome_reader_mode"
                        name="licence_number"
                        label="Licence Number"
                        outline
                        class="text_field_2 mt-2"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                        v-model="profile.qualification"
                        :rules="inputRules"
                        prepend-inner-icon="school"
                        name="qualification"
                        label="Qualification"
                        outline
                        class="text_field_2 mt-2"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                        v-model="profile.specialization"
                        :rules="inputRules"
                        prepend-inner-icon="assignment"
                        name="specialization"
                        label="Specialization"
                        outline
                        class="text_field_2 mt-2"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                        v-model="profile.experience_years"
                        :rules="inputRules"
                        prepend-inner-icon="assignment"
                        name="experience_years"
                        label="Experience Years"
                        outline
                        class="text_field_2 mt-2"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                        v-model="profile.residence"
                        :rules="inputRules"
                        prepend-inner-icon="apartment"
                        name="residence"
                        label="Residence"
                        outline
                        class="text_field_2 mt-2"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-menu>
                        <v-text-field
                            :rules="inputRules"
                            :value="formattedDate"
                            prepend-inner-icon="calendar_today"
                            slot="activator"
                            name="date_licence_renewal"
                            label="Licence Renewal Date"
                            outline
                            class="text_field_2 mt-2"
                            >
                        </v-text-field>
                        <v-date-picker v-model="profile.date_licence_renewal"></v-date-picker>
                    </v-menu>
                </v-flex>
                <v-flex xs12>
                    <v-textarea
                        v-model="profile.bio"
                        :rules="inputRules"
                        prepend-inner-icon="description"
                        name="bio"
                        label="Bio"
                        class="mt-2"
                        outline
                    ></v-textarea>
                </v-flex>
                
            </v-layout>
        </v-card-text>
        </v-card>
    </v-dialog>
   <v-img
        height="100%"
        src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
        >
        <v-layout column>
            <v-flex xs12>
                <v-avatar
                    class="profile"
                    color="grey"
                    size="164"
                    tile
                >
                    <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
                </v-avatar>
            </v-flex>
            <v-flex xs12>
                <div class="ma-2">
                    <div class="title white--text">{{getProfile.first_name}} {{getProfile.last_name}}</div>
                    <div class="white--text" v-if="$can('health_worker_profile') && getProfile.health_worker_profile != null">{{getProfile.health_worker_profile.worker_category.name}} - {{getProfile.health_worker_profile.worker_sub_category.name}}</div>
                </div>
            </v-flex>
        </v-layout>
        </v-img>
    <v-card
        class="mx-auto"
        max-width="374"
        elevation="0"
    >
        <v-card-text v-if="$can('health_worker_profile')">
            <div v-if="getProfile.health_worker_profile != null">{{getProfile.health_worker_profile.bio}}</div>
            <div v-if="getProfile.health_worker_profile != null" class="my-4 subtitle-1 black--text">
                {{getProfile.health_worker_profile.residence}}
            </div>
            <div v-if="getProfile.health_worker_profile != null">
                <v-rating
                :value="4.5"
                color="amber"
                dense
                half-increments
                readonly
                size="14"
                ></v-rating>
            </div>
            <div v-if="getProfile.health_worker_profile != null" class="grey--text">4.5 (413)</div>
            <div align="center" v-if="getProfile.health_worker_profile == null"><p>Create a Profile to be listed on the platform</p></div>
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
       
            <div align="center">
                <v-btn
                    depressed
                    class="primary white--text text-none mt-2"
                    text
                    @click="profileDialog = true"
                >
                    Edit
                    <v-icon right class="white--text">
                        edit
                    </v-icon>
                </v-btn>
            </div>
    </v-card>
  </div>
</template>
<script>
import format from 'date-fns/format'
import { mapGetters, mapActions } from 'vuex'
import { USER_REQUEST } from '@/store/actions/user'

export default {
    data(){
		return{
			color: '',
			message: '',
			snackbar: false,
            profileDialog: false,
            inputRules: [
				v => !!v || 'Field is required'
			],
            genders: [
                {id: 1, name: 'Male'},
                {id: 2, name: 'Female'},
            ],

            profile: {
                fname: '',
                lname: '',
                email: '',
                bio: '',
                gender_id: '',
                id_number: '',
                worker_category_id: '',
                worker_sub_category_id: '',
                licence_number: '',
                date_license_renewal: '',
                qualification: '',
                specialization: '',
                residence: '',
                experience_years: '',
                profile_pic: ''
            },

            workerSubCategories: []
		}
	},
    created(){
        this.initialize()
    },
    mounted() {
        this.assignProfile()
    },
	methods: {
        ...mapActions(['fetchWorkerCategories', 'USER_REQUEST']),
        initialize(){
            this.fetchWorkerCategories()
            this.USER_REQUEST()
        },
        assignProfile(){
            this.profile.fname = this.getProfile.first_name
            this.profile.lname = this.getProfile.last_name
            this.profile.email = this.getProfile.email
            if(this.getProfile.health_worker_profile != null){
                this.profile.bio = this.getProfile.health_worker_profile.bio
                this.profile.gender_id = this.getProfile.health_worker_profile.gender_id
                this.profile.id_number = this.getProfile.health_worker_profile.id_number
                this.profile.worker_category_id = this.getProfile.health_worker_profile.worker_category_id
                this.profile.worker_sub_category_id = this.getProfile.health_worker_profile.worker_sub_category_id
                this.profile.licence_number = this.getProfile.health_worker_profile.licence_number
                this.profile.date_licence_renewal = this.getProfile.health_worker_profile.date_licence_renewal
                this.profile.qualification = this.getProfile.health_worker_profile.qualification
                this.profile.specialization = this.getProfile.health_worker_profile.specialization
                this.profile.residence = this.getProfile.health_worker_profile.residence
                this.profile.experience_years = this.getProfile.health_worker_profile.experience_years
                this.profile.profile_pic = this.getProfile.health_worker_profile.profile_pic
            }
        },
        updateSubCategory(){
            var x = this.$store.getters.allWorkerCategories.find((category) => category.id == this.profile.worker_category_id)
            this.workerSubCategories = x.worker_sub_category
        }
    },
    computed: {
        ...mapGetters(['allWorkerCategories', 'getProfile']),
        subjobs(){
            return this.$store.getters.allWorkerCategories.find((category) => category.id == this.profile.worker_category_id)
        },
        formattedDate(){
        	return this.profile.date_licence_renewal ? format(this.profile.date_licence_renewal, 'Do MMM YYYY') : ''
    	},

    }
}
</script>>