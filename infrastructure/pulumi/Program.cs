using System.Net;
using Pulumi;
using Pulumi.ProxmoxVE;
using Pulumi.ProxmoxVE.Download;
using Pulumi.ProxmoxVE.Inputs;

return await Deployment.RunAsync(() =>
{
    var config = new Pulumi.Config("proxmoxve");

    var talosFile = new Pulumi.ProxmoxVE.Download.File("talos-file1", new Pulumi.ProxmoxVE.Download.FileArgs
    {
        DatastoreId = "local",
        // DecompressionAlgorithm = "gz",
        FileName = "talos-1.13.4-nocloud-amd64.img",
        ContentType = "iso",
        NodeName = "cad-server",
        Url = "https://factory.talos.dev/image/ce4c980550dd2ab1b17bbf2b08801c7eb59418eafe8f279833297925d67c7515/v1.13.4/nocloud-amd64.raw.xz"

    });

     var vm = new VmLegacy("talos", new VmLegacyArgs
        {
            NodeName = "cad-server",
            Name     = "talos",
            OnBoot   = true,
            Machine = "q35",
            Bios = "ovmf",
            
            Agent = new VmLegacyAgentArgs
            {
                Enabled = true,
            },

            Cpu = new VmLegacyCpuArgs
            {
                Cores   = 2,
                Sockets = 1,
            },

            TpmState = new VmLegacyTpmStateArgs
            {
                Version = "v2.0",
            },

            EfiDisk = new VmLegacyEfiDiskArgs
            {
                DatastoreId = "local-lvm",
                FileFormat = "raw",
                Type = "4m"
            },

            Memory = new VmLegacyMemoryArgs
            {
                Dedicated = 4096,
            },

            OperatingSystem = new VmLegacyOperatingSystemArgs
            {
                Type = "l26",
            },

            Disks =
            {
                // new VmLegacyDiskArgs
                // {
                //     DatastoreId = "local-lvm",
                //     Size        = 60,      // GB
                //     Interface = "virtio1",
                //     Ssd = true
                // },
                new VmLegacyDiskArgs
                {
                    DatastoreId = "local-lvm",
                    Size = 40,
                    Interface = "virtio0",
                    FileFormat = "raw",
                    FileId = talosFile.Id,
                }
            },

            NetworkDevices =
            {
                new VmLegacyNetworkDeviceArgs
                {
                    Bridge = "vmbr0",
                },
            },

            // Optional: initialization for Talos (nocloud, etc.) if you use cloud-init
            // Initialization = new VmLegacyInitializationArgs { ... },
        }, new CustomResourceOptions
        {
            IgnoreChanges = {"cdrom", "cdrom.fileId", "cdrom.enabled"}
        });
    
});