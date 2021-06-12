<!-- This file is released under the MIT License. See the LICENSE file. -->
<template>
    <div class="controls">
        <div class="user">
            <div>{{ name }}<br/>NIVEAU: {{ level }}<br/>{{ hp }}</div>
        </div>
        <div class="sphinge" v-bind:style="sphingeStyle"><img class="sphinge-logo" :src="require('../../../../../icon.png')"> SPHINGE {{ sphinge_hp }}%<br/>
            <div class="sphinge-hp-bar" v-bind:style="sphingeBarStyle"></div>
        </div>
        <div class="d-pad" ref="dPad"></div>
        <div class="actions">
            <div class="up" @click="up"></div>
            <div class="action" @click="action"></div>
            <div class="back" @click="back"></div>
            <div class="down" @click="down"></div>
        </div>
    </div>
</template>

<script>
import nipplejs from 'nipplejs'
import { Control } from '@rpgjs/client';

const DIRECTIONS = [Control.Left, Control.Right, Control.Up, Control.Down]

export default {
    name: 'controls',
    inject: ['rpgScene', 'rpgCurrentPlayer', 'rpgObjects'],
    data() {
      return {
          name: "ANONYME",
          level: "",
          hp: "",
          sphinge_hp: "",
      }
    },
    mounted() {
        this.obsCurrentPlayer = this.rpgCurrentPlayer
            .subscribe(({ object }) => {
                this.name = object.name
                this.level = "⭐".repeat(object.level)
                this.hp = `${"❤️".repeat(object.hp)}${"🖤".repeat(10 - object.hp)}`;
            })
        this.obsObjects = this.rpgObjects
            .subscribe((objects) => {
               for (let key in objects) {
                   if (objects[key].object.name == "EV-SPHINGE")
                      this.sphinge_hp = objects[key].object.hp
               }
            })
       const manager  = nipplejs.create({
            zone: this.$refs.dPad
        })
        let directions = {}
        let moving = false
        manager.on('added', (evt, nipple) => {
            const keyup = (key) => {
                 this.rpgScene().applyControl(key, false)
            }
            const end = () => {
                moving = false
                for (let key of DIRECTIONS) {
                    keyup(key)
                }
            }
            nipple.on('end', end)
            nipple.on('move', (evt, data) => {
               if (data.direction) {
                    const degree = data.angle.degree
                    const { x, y, angle } = data.direction
                    directions = {
                        [angle]: true
                    }
                    for (let i = 0 ; i < 4 ; i++) {
                        const corner = 90 * i + 45
                        if (degree < corner + 20 && degree > corner - 20) {
                            directions = {
                                [x]: true,
                                [y]: true
                            }
                        }
                    }

                    for (let dir of DIRECTIONS) {
                        if (!directions[dir]) {
                            keyup(dir)
                        }
                    }

                    moving = true
               }
            })
            setInterval(() => {
                if (moving) {
                    for (let dir in directions) {
                        this.rpgScene().applyControl(dir, true)
                    }
                }
            }, 200)
        })

    },
    unmounted() {
        this.obsCurrentPlayer.unsubscribe()
    },
    computed: {
        sphingeStyle() {
           return this.sphinge_hp > 0 ? "" : "display: none";
        },
        sphingeBarStyle() {
           return `width: ${this.sphinge_hp}%`;
        }
    },
    methods: {
        back() {
            this.rpgScene().applyControl('back')
        },
        up() {
            this.rpgScene().applyControl(Control.Up, true)
            this.rpgScene().applyControl(Control.Up, false)
        },
        action() {
            this.rpgScene().applyControl('action')
        },
        down() {
            this.rpgScene().applyControl(Control.Down, true)
            this.rpgScene().applyControl(Control.Down, false)
        },
    }
}
</script>

<style scoped>
.controls {
    z-index: 100;
    height: 100%;
    position: absolute;
    width: 100%;
}

.user {
  background: black;
  opacity: 0.8;
  color: white;
  position: absolute;
  left: 10px;
  top: 10px;
  padding: .2em;
}

.sphinge {
  background: black;
  opacity: 0.8;
  position: absolute;
  color: white;
  top: 10px;
  right: 10px;
  padding: .2em;
  width: 10em;
}

.sphinge-logo {
  width: 2em;
  height: 2em;
  vertical-align: middle;
}

.sphinge-hp-bar {
  background: linear-gradient(to right, red, yellow);
  height: 10px;
  display: inline-block;
}

.d-pad {
    width: 70%;
    position: absolute;
    height: 100%;
}

.actions {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
}

.up {
    background-image: url('./assets/up.png');
    width: 80px;
    height: 80px;
    opacity: 0.8;
}

.back {
    background-image: url('./assets/back.png');
    width: 80px;
    height: 80px;
    opacity: 0.8;
}

.action {
    background-image: url('./assets/action.png');
    width: 80px;
    height: 80px;
    opacity: 0.8;
}

.down {
    background-image: url('./assets/down.png');
    width: 80px;
    height: 80px;
    opacity: 0.8;
}

</style>
