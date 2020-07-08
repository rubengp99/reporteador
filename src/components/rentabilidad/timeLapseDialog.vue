<template>
    <div class="mWidth">
        <v-dialog v-model="dialog" persistent transition="scale-transition" transition-mode="in-out">
            
            <v-stepper v-model="e1" alt-labels>
                <v-stepper-header>
                    <v-stepper-step :complete="e1 > 1" step="1">Lapso A</v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step :complete="e1 > 2" step="2">Lapso B</v-stepper-step>

                </v-stepper-header>

                <v-stepper-items>
                    <v-stepper-content step="1">
                        <v-card outlined elevatio=0 class="mb-2">
                            <slot name="lapse-a"></slot>
                        </v-card>

                        <v-btn color="indigo" @click="e1 = 2" style="margin-left: 20px;color:white;" :disabled="disabled"> <v-icon>check</v-icon> <strong>siguiente</strong></v-btn>
                        <slot name="close"></slot>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <v-card outlined elevatio=0 class="mb-2">
                            <slot name="lapse-b"></slot>
                        </v-card>

                        <slot name="ok"></slot>
                        <slot name="close"></slot>
                    </v-stepper-content>

                </v-stepper-items>
            </v-stepper>
        </v-dialog>
    </div>
</template>

<script>
import w from '@/services/variables'

export default {
    name:'lapseDialog',
    props:{
        dialog:{
            type:Boolean,
            default:false,
        },
        disabled:{
            type:Boolean,
            default:false,
        },
    },
    data(){
        return{
            ...w,
            e1: 1,
        }
    }
}
</script>