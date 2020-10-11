<template>
    <div>
        <v-dialog v-model="showColorDialog" transition="dialog-bottom-transition" width="300px">
            <v-card>
                <v-card-title>
                    <span class="headline">Color de Lápiz</span>
                </v-card-title>
                <v-card-text>
                    <div class="color-container">
                        <Compact id="color-select" v-model="color"/>
                    </div>
                    <v-row>
                        <v-col class="d-flex flex-row-reverse" cols="12" md="12">
                            <v-btn color="primary" @click="showColorDialog = false">Cerrar</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showFileDialog" transition="dialog-bottom-transition" width="40%">
            <v-card>
                <v-card-title>
                    <span class="headline">Imagen de Fondo</span>
                </v-card-title>
                <v-card-text>
                    <ImageInput ref="imageInput" label="Imagen de Fondo" @onFileSelected="background = $event"/>
                    <v-row class="d-flex flex-row-reverse">
                        <v-btn color="primary" @click="showFileDialog = false;$refs.imageInput.clear()">Cerrar</v-btn>
                        <v-btn class="mr-4" color="primary" @click="setBackground">Aceptar</v-btn>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <div class="d-flex justify-center">
            <canvas id="canvas" ref="canvas" height="600px" width="1066px" @mousedown="onMouseDown" @mouseup="onMouseUp"
                    @mouseleave="onMouseLeave" @mousemove="onMouseMove" @resize="onResize"/>
            <div class="cursor" id="cursor"></div>
        </div>
        <v-container>
            <v-row class="d-flex justify-center">
                <v-col class="d-flex justify-center" cols="12" md="2">
                    <v-switch v-model="options.restrictY" label="Solo Horizontal" @change="onChangeSwitch('y')"/>
                </v-col>
                <v-col class="d-flex justify-center" cols="12" md="2">
                    <v-switch v-model="options.restrictX" label="Solo Vertical" @change="onChangeSwitch('x')"/>
                </v-col>
                <v-col class="d-flex justify-center" cols="12" md="2">
                    <v-select :items="sizes" label="Tamaño de Lápiz" v-model="size"/>
                </v-col>
                <v-col class="d-flex" cols="12" md="2">
                    <span class="d-inline-block align-self-center" id="brush-color">Color de pincel</span>
                    <div class="d-inline-block align-self-center" id="current-color"
                         :style="'background-color:' + color.hex" @click="showColorDialog = true"/>
                </v-col>
            </v-row>
            <v-row class="d-flex justify-center">
                <v-col class="d-flex justify-center" cols="8" md="2">
                    <v-btn color="primary" block @click="showFileDialog = true">Cargar Imagen</v-btn>
                </v-col>
                <v-col class="d-flex justify-center" cols="8" md="2">
                    <v-btn color="primary" block @click="back">Retroceder</v-btn>
                </v-col>
                <v-col class="d-flex justify-center" cols="8" md="2">
                    <v-btn color="primary" block @click="saveImage">Guardar</v-btn>
                </v-col>
                <v-col class="d-flex justify-center" cols="8" md="2">
                    <v-btn color="primary" block @click="clear">Limpiar</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { Compact } from "vue-color";
import ImageInput from "@/components/ImageInput";

export default {
    name: "Board",
    components: {
        ImageInput,
        Compact
    },
    data: () => ({
        mouseDown: false,
        canvas: null,
        ctx: null,
        mouseX: 0,
        mouseY: 0,
        history: [],
        color: { hex: "#D33115" },
        size: 6,
        sizes: [
            3,
            6,
            10,
            15,
            25
        ],
        background: "",
        options: {
            restrictY: false,
            restrictX: false
        },
        showColorDialog: false,
        showFileDialog: false
    }),
    methods: {
        clear: function ()
        {
            this.history = [];
            this.background = "";
            this.redraw();
        },
        onChangeSwitch: function (sender)
        {
            if (sender === "y" && this.options.restrictY)
            {
                this.options.restrictX = false;
            }
            else if (sender === "x" && this.options.restrictX)
            {
                this.options.restrictY = false;
            }
        },
        onMouseDown: function (e)
        {
            this.mouseDown = true;
            this.mouseX = e.offsetX;
            this.mouseY = e.offsetY;
            this.setDummyPoint();
        },
        onMouseUp: function ()
        {
            if (this.mouseDown)
            {
                this.setDummyPoint();
            }
            this.mouseDown = false;
        },
        onMouseLeave: function ()
        {
            if (this.mouseDown)
            {
                this.setDummyPoint();
            }
            this.mouseDown = false;
        },
        onMouseMove: function (e)
        {
            this.moveMouse(e);
            if (!this.mouseDown)
            {
                return;
            }

            if (!this.options.restrictX)
            {
                this.mouseX = e.offsetX;
            }
            if (!this.options.restrictY)
            {
                this.mouseY = e.offsetY;
            }

            let item = {
                type: 'line',
                isDummy: false,
                x: this.mouseX,
                y: this.mouseY,
                c: this.color.hex,
                r: this.size,
                step: 0
            };
            if (this.history.length !== 0)
            {
                item["step"] = this.history[this.history.length - 1].step;
            }

            this.history.push(item);
            this.draw(item, this.history.length);

        },
        onResize: function ()
        {
            this.setSize();
            this.redraw();
        },
        getDummyItem() //generates dummy item based on last item
        {
            if (this.history.length > 0)
            {
                let lastPoint = this.history[this.history.length - 1];
                let item = {
                    type: 'line',
                    isDummy: true,
                    x: lastPoint.x,
                    y: lastPoint.y,
                    c: null,
                    r: null,
                    step: lastPoint.step
                };
                if (lastPoint.isDummy)
                {
                    item['step'] += 1;
                }
                return item;
            }
            return null;
        },
        setDummyPoint()
        {
            let item = this.getDummyItem();
            if (item !== null)
            {
                this.history.push(item);
                this.draw(item, this.history.length);
            }
        },
        moveMouse(e)
        {
            let x = e.offsetX;
            let y = e.offsetY;

            let cursor = document.getElementById("cursor");
            cursor.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
        },
        setSize()
        {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight - 60;
        },
        redraw()
        {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.setBackground().then(() =>
            {
                this.history.forEach((item, i) =>
                {
                    this.draw(item, i);
                });
            });
            if (!this.history.length)
            {
                return true;
            }
        },
        draw(item, i)
        {
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";

            let prevItem = this.history[i - 2];
            if (i < 2)
            {
                return false;
            }

            if (!item.isDummy && !this.history[i - 1].isDummy && !prevItem.isDummy)
            {
                this.ctx.strokeStyle = item.c;
                this.ctx.lineWidth = item.r;

                this.ctx.beginPath();
                this.ctx.moveTo(prevItem.x, prevItem.y);
                this.ctx.lineTo(item.x, item.y);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            else if (!item.isDummy)
            {
                this.ctx.strokeStyle = item.c;
                this.ctx.lineWidth = item.r;

                this.ctx.beginPath();
                this.ctx.moveTo(item.x, item.y);
                this.ctx.lineTo(item.x, item.y);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        },
        setBackground(isNew)
        {
            if (isNew)
            {
                this.history = [];
                this.$refs.imageInput.clear();
            }
            return new Promise(resolve =>
            {
                if (this.background === "")
                {
                    resolve();
                }
                let url = URL.createObjectURL(this.background);
                let image = new Image();
                let context = this.ctx;
                image.onload = function ()
                {
                    context.drawImage(image, 0, 0, image.width, image.height, 0, 0, 1066, 600);
                    resolve();
                };
                image.src = url;
                this.showFileDialog = false;
            });
        },
        back()
        {
            if (this.history.length === 0)
            {
                return;
            }
            let lastStep = this.history[this.history.length - 1].step;

            for (let i = this.history.length - 1; i >= 0; i--)
            {
                // console.log(this.history[i]);
                if (this.history[i].step === lastStep)
                {
                    this.history.pop();
                }
            }
            //this.history.splice(lastStep.from, lastStep.to - lastStep.from + 1);
            this.redraw();
        },
        onClickButtonCircle(color)
        {
            if (this.numberColor === color)
            {
                this.numberColor = '';
                return;
            }
            this.numberColor = color;
        },
        drawLine(item, i)
        {
            let prevItem = this.history[i - 2];

            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";

            if (!item.isDummy && !this.history[i - 1].isDummy && !prevItem.isDummy)
            {
                this.ctx.strokeStyle = item.c;
                this.ctx.lineWidth = item.r;

                this.ctx.beginPath();
                this.ctx.moveTo(prevItem.x, prevItem.y);
                this.ctx.lineTo(item.x, item.y);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            else if (!item.isDummy)
            {
                this.ctx.strokeStyle = item.c;
                this.ctx.lineWidth = item.r;

                this.ctx.beginPath();
                this.ctx.moveTo(item.x, item.y);
                this.ctx.lineTo(item.x, item.y);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        },
        saveImage()
        {
            console.log(this.canvas.toDataURL('image/png'))
        }
    },
    mounted()
    {
        this.canvas = this.$refs.canvas;
        this.ctx = this.canvas.getContext("2d");
    }
};
</script>

<style scoped>
canvas
{
    border: 2px solid #448aff;
}

.cursor
{
    position: fixed;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid rgb(30, 30, 30);
    pointer-events: none;
    user-select: none;
    mix-blend-mode: difference;
    opacity: 0;
    transition: opacity 1s;
}

#current-color
{
    height: 25px;
    width: 25px;
    border-radius: 4px;
    cursor: pointer;
}

#brush-color
{
    margin: 0 10px 0 20px;
}
</style>