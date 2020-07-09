<template>
    <div class="mWidth">
        <v-dialog v-model="dialog" persistent transition="scale-transition" transition-mode="in-out">
            <v-card class="mx-auto" outlined>
                <slot name="close"></slot>
                <img v-if="selectedItem.stock <= 0" src="@/assets/agotado.png" width="150px" height="75px" style="flex: 0 0 0%;position:absolute;top: 55px;left: 15px;z-index: 1;">
                <v-list-item three-line>
                    <v-list-item-avatar tile size="150" color="grey lighten-1">
                        <img :src="typeof selectedItem.image === 'undefined'  || selectedItem.image === 'default.png' ? require('@/assets/box.svg') : image + selectedItem.image ">
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <div class="overline mb-4">PESTAÑA DETALLADA</div>
                        <v-list-item-title class="title mb-1" style="white-space: normal;word-wrap:nowrap;text-overflow:none;line-height:1.3rem;font-size:1.1rem;">
                            {{ selectedItem === null ? null : selectedItem.name}}
                        </v-list-item-title>
                        <v-list-item-subtitle style="padding-top:15px;">
                            <div class="caption mb-1" style="color:black;">DESCRIPCIÓN</div>
                            <p class="overline" style="color:#424242">{{ selectedItem === null ? null : selectedItem.description}}</p>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list disabled style="margin-top:-30px;text-align:left;">
                    <v-subheader style="color:black;" class="subtitle-1">Detalles de Existencias</v-subheader>
                    <v-list-item-group v-model="selectedItem" color="primary">
                        <v-list-item >
                            <v-list-item-content style="padding: 6px 0;width:50%">
                                <p class="caption mb-1 ml-2" ><strong>Existencia mínima:</strong> {{ selectedItem.stockMin !== null ? selectedItem.stockMin : '---' }}</p>
                                <p class="caption ml-2" ><strong>Existencia máxima:</strong> {{ selectedItem.stockMax !== null ? selectedItem.stockMin : '---' }}</p>
                            </v-list-item-content>
                            <v-list-item-content style="padding: 6px 0;width:50%;text-align:left;">
                                <p class="caption mb-1 ml-1" ><strong>Referencia:</strong> {{ selectedItem.reference !== null ? selectedItem.reference : '---' }}</p>
                                <p class="caption ml-1" ><strong>Vendidos:</strong> {{ selectedItem.sold !== null ? selectedItem.sold : '---' }} unidades.</p>
                            </v-list-item-content>
                            <p class="overline" >&nbsp;</p>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import w from '@/services/variables'

export default {
    name:'concepto',
    props:{
        dialog:{
            type:Boolean,
            default:false,
        },
        selectedItem:{
            type:Object,
            default:() => {}
        }
    },
    data(){
        return{
            ...w,
        }
    }
}
</script>