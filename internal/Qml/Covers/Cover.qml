import QtQuick
import QtQuick.Layouts
import Qt5Compat.GraphicalEffects

Item {
    id: downloadButton
    width: 256
    height: 512

    property string appName: "Webcamoid"
    property int stripeWidth: 3
    property int textPointSize: 20
    property int iconSize: 128
/**
    property color stripeColor: Qt.rgba(0, 0.66, 0.33)
    property string buttonIcon: "android.svg"
    property string buttonText: "Android"
    property string architecture: ""
//*/
/**/
    property color stripeColor: Qt.rgba(0.25, 0.16, 0.5)
    property string buttonIcon: "linux.svg"
    property string buttonText: "Linux"
    //property string architecture: "x86_64"
    //property string architecture: "ARM 64"
    property string architecture: "ARM 32"
//*/
/**
    property color stripeColor: Qt.rgba(0, 0.33, 0.66)
    property string buttonIcon: "windows.svg"
    property string buttonText: "Windows"
    property string architecture: ""
//*/
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
        spacing: 16

        Image {
            source: "webcamoid.svg"
            anchors.horizontalCenter: parent.horizontalCenter
            width: 0.75 * downloadButton.iconSize
            height: width
            smooth: true
            mipmap: true
        }
        Text {
            text: downloadButton.appName
            anchors.horizontalCenter: parent.horizontalCenter
            font.pointSize: downloadButton.textPointSize
            font.bold: true
            color: "white"
        }
        Text {
            text: qsTr("for")
            anchors.horizontalCenter: parent.horizontalCenter
            font.pointSize: downloadButton.textPointSize
            font.bold: true
            color: "white"
        }
        Image {
            source: downloadButton.buttonIcon
            anchors.horizontalCenter: parent.horizontalCenter
            width: downloadButton.iconSize
            height: width
            smooth: true
            mipmap: true
        }
        Text {
            text: downloadButton.buttonText
            anchors.horizontalCenter: parent.horizontalCenter
            font.pointSize: downloadButton.textPointSize
            font.bold: true
            color: "white"
        }
    }
    Rectangle {
        color: "red"
        width: 64
        height: 32
        radius: 8
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        anchors.rightMargin: 16
        anchors.bottomMargin: 16
        visible: downloadButton.architecture.length > 0

        Text {
            text: downloadButton.architecture
            anchors.centerIn: parent
            font.pointSize: 0.6 * downloadButton.textPointSize
            font.bold: true
            color: "white"
        }
    }
}
