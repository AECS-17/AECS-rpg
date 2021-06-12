<!-- This file is released under the MIT License. See the LICENSE file. -->
<template>
</template>

<script>
export default {
    name: 'gameover',
    inject: ['rpgScene', 'rpgStage', 'rpgGui'],
    mounted() {
        this.rpgScene().stopInputs()
        const blur = new PIXI.filters.BlurFilter()
        this.rpgStage.filters = [blur]
    },
    unmounted() {
        this.rpgStage.filters = []
    }
}
</script>