<!-- This file is released under the MIT License. See the LICENSE file. -->
<template>
   <div style="height: 6em"></div>
   <div class="item-menu">
        <rpg-window :fullWidth="true" height="50%">
            <div class="row">
               <rpg-choice :choices="mapItems" :column="1" @change="selected" ref="choice">
                   <template v-slot:default="{ choice }">
                       <p class="space-between item">
                           <span>{{ choice.text }}</span>
                        </p>
                   </template>
               </rpg-choice>
            </div>
        </rpg-window>
        <rpg-window :fullWidth="true">
            <p>{{ description }}</p>
        </rpg-window>
   </div>
</template>

<script>

export default {
    name: 'items',
    inject: ['rpgCurrentPlayer', 'rpgKeypress', 'rpgSocket', 'rpgGui',
            'rpgScene', 'rpgStage', 'rpgGuiClose'],
    data() {
        return {
            description: '',
            items: [],
        }
    },
    computed: {
        mapItems() {
            return this.items.map(it => ({
                text: it.item.name,
            }))
        }
    },
    mounted() {
        this.rpgScene().stopInputs()
        const blur = new PIXI.filters.BlurFilter()
        this.rpgStage.filters = [blur]
        this.obsCurrentPlayer = this.rpgCurrentPlayer.subscribe(({ object }) => {

           this.items = Object.values(object.items || {})
        })
        this.obsKeyPress = this.rpgKeypress.subscribe(({ control }) => {
            if (!control) return
            if (control.actionName == 'back') {
                this.rpgGui.hide('items')
            }
        })
        this.selected(0)
    },
    unmounted() {
        this.obsKeyPress.unsubscribe()
        this.obsCurrentPlayer.unsubscribe()
        this.rpgScene().listenInputs()
        this.rpgStage.filters = []
    },
    methods: {
        selected(index) {
            if (!this.items[index]) return
            this.description = `${this.items[index].item.name} : ${this.items[index].item.description}`
        },
    }
}
</script>

<style scoped>
.row {
   height: 100%;
}

.item-menu {
    height: 100%;
}

.item {
    margin: 0;
    position: relative;
    padding: 10px;
}

.space-between {
    justify-content: space-between;
    display: flex;
}
</style>
