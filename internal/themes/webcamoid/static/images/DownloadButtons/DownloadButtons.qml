import QtQuick
import QtQuick.Layouts
import Qt5Compat.GraphicalEffects

Item {
    id: downloadButton
    width: 256
    height: 128
/*
    property int stripeWidth: 3
    property color stripeColor: Qt.rgba(0, 0.66, 0.33)
    property string buttonIcon: "binary.svg"
    property string buttonText: "Binary Packages"
    property int textPointSize: 20
*/

    property int stripeWidth: 3
    property color stripeColor: Qt.rgba(0.25, 0.16, 0.5)
    property string buttonIcon: "daily.svg"
    property string buttonText: "Daily Build"
    property int textPointSize: 20

/*
    property int stripeWidth: 3
    property color stripeColor: Qt.rgba(0.66, 0.49, 0)
    property string buttonIcon: "sources.svg"
    property string buttonText: "Source Code"
    property int textPointSize: 20
*/
    Item {
        id: buttonStripes
        anchors.fill: parent

        function brightness(color, b) {
            return Qt.rgba(color.r * b, color.g * b, color.b * b, color.a)
        }

        Row {
            Repeater {
                model: Math.round(buttonStripes.width / downloadButton.stripeWidth)

                Row {
                    Rectangle {
                        width: downloadButton.stripeWidth
                        height: buttonStripes.height
                        color: downloadButton.stripeColor
                    }
                    Rectangle {
                        width: downloadButton.stripeWidth
                        height: buttonStripes.height
                        color: buttonStripes.brightness(downloadButton.stripeColor, 0.5)
                    }
                }
            }
        }

        transform: [
            Rotation {
                origin.x: width / 2
                origin.y: height / 2
                axis {
                    x: 0
                    y: 0
                    z: 1

                }
                angle: -45
            },
            Scale {
                origin.x: width / 2
                origin.y: height / 2
                xScale: 3
                yScale: 3
            }
        ]
    }
    RadialGradient {
        x: parent.width - parent.height
        width: parent.height
        height: parent.height
        horizontalOffset: width / 2
        verticalOffset: height / 2
        opacity: 0.25
        gradient: Gradient {
            GradientStop { position: 0.0; color: "white" }
            GradientStop { position: 1; color: "transparent" }
        }
    }
    Rectangle {
        id: rect
        width: parent.width + radius / 2
        height: parent.height + radius / 2
        anchors.centerIn: parent
        color: Qt.rgba(0, 0, 0, 0)
        radius: 32
        border.color: Qt.rgba(0, 0, 0, 1)
        border.width: radius / 2
        smooth: true
    }
    ShaderEffectSource {
        id: blurSource
        width: parent.width + rect.radius / 2
        height: parent.height + rect.radius / 2
        anchors.centerIn: parent
        format: ShaderEffectSource.RGBA8
        hideSource: true
        sourceItem: rect
        live: true
        visible: false
    }
    FastBlur {
        width: parent.width + rect.radius / 2
        height: parent.height + rect.radius / 2
        anchors.centerIn: parent
        source: blurSource
        transparentBorder: true
        radius: 32
        opacity: 0.8
    }
    Column {
        anchors.centerIn: parent

        Image {
            source: downloadButton.buttonIcon
            anchors.horizontalCenter: parent.horizontalCenter
            width: 48
            height: width
            //smooth: true
            //mipmap: true
        }
        Text {
            text: downloadButton.buttonText
            font.pointSize: downloadButton.textPointSize
            font.bold: true
            color: "white"
        }
    }
}
